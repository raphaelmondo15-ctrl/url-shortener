import { Router } from 'express';
import {testDbConnection} from '../controllers/db.controller.js';
import { createLink, getOriginalLink } from '../controllers/link.controller.js';
import { validateLink } from '../middleware/validateLink.middleware.js';


const router = Router();

router.get('/test-db', testDbConnection);
router.post('/shorten', validateLink, createLink);
router.get('/:short_code', getOriginalLink);

export default router;
