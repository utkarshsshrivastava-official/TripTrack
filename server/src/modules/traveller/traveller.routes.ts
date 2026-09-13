import { Router } from 'express';
import { getTravellers, updateTraveller, seedTravellers } from './traveller.controller';

const router = Router();

router.get('/', getTravellers);
router.put('/:id', updateTraveller);
router.post('/seed', seedTravellers);

export default router;
