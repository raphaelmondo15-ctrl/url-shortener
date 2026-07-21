import { Router } from 'express';
import { createLink, redirectLink } from '../controllers/link.controller.js';
import { validateLink } from '../middleware/validateLink.middleware.js';
import { getLinkMetadata } from '../controllers/link.controller.js';
import { getClickslog } from '../controllers/link.controller.js';
import { deleteLink } from '../controllers/link.controller.js';


const router = Router();


router.post('/links', validateLink, createLink);
router.get('/links/:code', getLinkMetadata);
router.get('/links/:code/clicks', getClickslog);
router.delete('/links/:code', deleteLink);
router.get('/:code', redirectLink);

export default router;
