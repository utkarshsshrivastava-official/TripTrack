import { Router } from 'express';
import {
  getExpensesHandler,
  createExpenseHandler,
  updateExpenseHandler,
  syncBulkExpensesHandler,
  deleteExpenseHandler,
  clearAllExpensesHandler
} from './expense.controller';

const router = Router();

router.get('/', getExpensesHandler);
router.post('/', createExpenseHandler);
router.put('/:id', updateExpenseHandler);
router.post('/sync', syncBulkExpensesHandler);
router.delete('/clear-all', clearAllExpensesHandler);
router.delete('/:id', deleteExpenseHandler);

export default router;
