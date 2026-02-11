
import { Router } from 'express';
import { SUPPORTED_TOKENS, SUPPORTED_VENUES } from '../config/registry.js';

const router = Router();

router.get('/venues', (_req, res) => {
    res.json({
        success: true,
        data: SUPPORTED_VENUES
    });
});

router.get('/tokens', (_req, res) => {
    res.json({
        success: true,
        data: SUPPORTED_TOKENS
    });
});

export default router;
