import { Router } from 'express';
import {
  getFeedHandler,
  createFeedItemHandler,
  deleteFeedItemHandler,
  clearFeedHandler
} from './feed.controller';

const router = Router();

router.get('/', getFeedHandler);
router.post('/', createFeedItemHandler);
router.delete('/clear-all', clearFeedHandler);
router.delete('/:id', deleteFeedItemHandler);

export default router;
