import { Router } from 'express';
import {
  getExpensesHandler,
  createExpenseHandler,
  syncBulkExpensesHandler,
  deleteExpenseHandler,
  clearAllExpensesHandler
} from './expense.controller';

const router = Router();

router.get('/', getExpensesHandler);
router.post('/', createExpenseHandler);
router.post('/sync', syncBulkExpensesHandler);
router.delete('/clear-all', clearAllExpensesHandler);
router.delete('/:id', deleteExpenseHandler);

export default router;
