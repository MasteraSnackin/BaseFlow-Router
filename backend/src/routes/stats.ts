
import { Router } from 'express';
import { statsService } from '../services/stats.js';

const router = Router();

router.get('/', (_req, res) => {
    res.json({
        success: true,
        data: statsService.getStats()
    });
});

export default router;
