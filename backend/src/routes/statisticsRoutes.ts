import express from 'express';
import { getStatistics } from '../controllers/statisticsController';

const router = express.Router();

// GET /api/statistics
router.get('/', getStatistics);

export default router;
