import { Router } from 'express';
import { createShortLink, getOriginalLink } from '../controllers/link.controller.js';

const router = Router();

router.post('/links', createShortLink);
router.get('/:short_code', getOriginalLink);
router.get('/links/:short_url', getOriginalLink);

export default router;
