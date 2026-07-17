import { Router } from 'express';
import { createLink, getOriginalLink } from '../controllers/link.controller.js';
import { validateLink } from '../middleware/validateLink.middleware.js';
import { deleteLink } from '../controllers/link.controller.js';


const router = Router();


router.post('/shorten', validateLink, createLink);
//router.get('/links/:short_url/export', exportClicksToCSV);
router.delete('/links/:short_url', deleteLink);
router.get('/:short_url', getOriginalLink);

export default router;
