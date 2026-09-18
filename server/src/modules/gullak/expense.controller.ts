import { Request, Response } from 'express';
import { ExpenseModel } from '../../models/expense.model';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { getIO, FAMILY_ROOM } from '../chat/socket.service';

// In-memory fallback if MongoDB is not connected
let memoryExpenses: any[] = [];

export async function getExpensesHandler(_req: Request, res: Response): Promise<void> {
  try {
    if (isMongoConnected()) {
      const expenses = await ExpenseModel.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        mode: 'mongodb',
        data: expenses.map(e => ({
          id: e.id,
          title: e.title,
          amountINR: e.amountINR,
          paidBy: e.paidBy,
          category: e.category,
          receiptUrl: e.receiptUrl,
          paymentSplits: e.paymentSplits,
          splitMode: e.splitMode,
          owedSplits: e.owedSplits,
          createdAt: e.createdAt.toISOString()
        }))
      });
      return;
    }

    res.json({
      success: true,
      mode: 'memory',
      data: memoryExpenses
    });
  } catch (err: any) {
    console.error('⚠️ [Expenses API] Error fetching expenses:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createExpenseHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id, title, amountINR, paidBy, category, receiptUrl, paymentSplits, splitMode, owedSplits, createdAt } = req.body;

    if (!id || !title || amountINR === undefined || !paidBy || !category) {
      res.status(400).json({ success: false, error: 'Missing required expense fields' });
      return;
    }

    const payload = {
      id,
      title,
      amountINR: Number(amountINR),
      paidBy,
      category,
      receiptUrl,
      paymentSplits,
      splitMode,
      owedSplits,
      createdAt: createdAt ? new Date(createdAt) : new Date()
    };

    if (isMongoConnected()) {
      await ExpenseModel.findOneAndUpdate(
        { id },
        payload,
        { upsert: true, new: true }
      );
    } else {
      const idx = memoryExpenses.findIndex(e => e.id === id);
      if (idx >= 0) {
        memoryExpenses[idx] = { ...payload, createdAt: payload.createdAt.toISOString() };
      } else {
        memoryExpenses.unshift({ ...payload, createdAt: payload.createdAt.toISOString() });
      }
    }

    // Broadcast via Socket.io to all devices in the pilgrimage room
    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('receive_expense', {
        ...payload,
        createdAt: payload.createdAt.toISOString()
      });
    }

    res.status(201).json({
      success: true,
      data: {
        ...payload,
        createdAt: payload.createdAt.toISOString()
      }
    });
  } catch (err: any) {
    console.error('⚠️ [Expenses API] Error saving expense:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function syncBulkExpensesHandler(req: Request, res: Response): Promise<void> {
  try {
    const { expenses } = req.body;
    if (!Array.isArray(expenses) || expenses.length === 0) {
      res.json({ success: true, count: 0, message: 'No expenses to sync' });
      return;
    }

    const io = getIO();

    if (isMongoConnected()) {
      for (const item of expenses) {
        if (!item.id || !item.title) continue;
        const payload = {
          id: item.id,
          title: item.title,
          amountINR: Number(item.amountINR) || 0,
          paidBy: item.paidBy,
          category: item.category,
          receiptUrl: item.receiptUrl,
          paymentSplits: item.paymentSplits,
          splitMode: item.splitMode,
          owedSplits: item.owedSplits,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
        };

        await ExpenseModel.findOneAndUpdate(
          { id: item.id },
          payload,
          { upsert: true, new: true }
        );

        if (io) {
          io.to(FAMILY_ROOM).emit('receive_expense', {
            ...payload,
            createdAt: payload.createdAt.toISOString()
          });
        }
      }
    } else {
      for (const item of expenses) {
        const idx = memoryExpenses.findIndex(e => e.id === item.id);
        const record = {
          ...item,
          createdAt: item.createdAt || new Date().toISOString()
        };
        if (idx >= 0) {
          memoryExpenses[idx] = record;
        } else {
          memoryExpenses.unshift(record);
        }
        if (io) {
          io.to(FAMILY_ROOM).emit('receive_expense', record);
        }
      }
    }

    console.log(`💰 [Gullak API] Successfully synced ${expenses.length} offline-queued expenses to MongoDB Atlas.`);
    res.json({ success: true, count: expenses.length });
  } catch (err: any) {
    console.error('⚠️ [Expenses API] Error bulk syncing expenses:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteExpenseHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      await ExpenseModel.findOneAndDelete({ id });
    } else {
      memoryExpenses = memoryExpenses.filter(e => e.id !== id);
    }

    // Broadcast deletion to all family devices
    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('expense_removed', { id });
    }

    res.json({ success: true, message: `Expense ${id} deleted` });
  } catch (err: any) {
    console.error('⚠️ [Expenses API] Error deleting expense:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function clearAllExpensesHandler(_req: Request, res: Response): Promise<void> {
  try {
    if (isMongoConnected()) {
      await ExpenseModel.deleteMany({});
    }
    memoryExpenses = [];

    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('expenses_cleared', { timestamp: new Date().toISOString() });
    }

    console.log('💰 [Gullak API] All expenses cleared across cloud and connected devices.');
    res.json({ success: true, message: 'All expenses cleared' });
  } catch (err: any) {
    console.error('⚠️ [Expenses API] Error clearing expenses:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
