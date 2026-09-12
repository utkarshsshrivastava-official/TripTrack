import { Router } from 'express';
import { initSeedData } from './seed.controller';

const router = Router();

// GET /api/seed/init - seeds the initial travel segments into database
router.get('/init', initSeedData);

export default router;
