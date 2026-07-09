import { Router } from 'express';
import {testDbConnection} from '../controllers/db.controller.js';
import { createShortLink, getOriginalLink } from '../controllers/link.controller.js';

const router = Router();

router.get('/test-db', testDbConnection);
router.post('/shorten', createShortLink);
router.get('/:short_url', getOriginalLink);

export default router;
