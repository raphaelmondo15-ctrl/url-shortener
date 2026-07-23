// import { Router } from 'express';
// import { createLink, redirectLink } from '../controllers/link.controller.js';
// import { validateLink } from '../middleware/validateLink.middleware.js';
// import { getLinkMetadata } from '../controllers/link.controller.js';
// import { getClickslog } from '../controllers/link.controller.js';
// import { deleteLink } from '../controllers/link.controller.js';
// import { toCSV } from '../utils/csv.js';


// const router = Router();


// router.post('/links', validateLink, createLink);
// router.get('/links/:code', getLinkMetadata);
// router.get('/links/:code/clicks', getClicksLog);
// router.delete('/links/:code', deleteLink);
// router.get('/links/:code/export', exportClicks);
// router.get('/:code', redirectLink);

// export default router;

import { Router } from 'express';
import {
    createLink,
    redirectLink,
    getLinkInfo,
    getClicksLog,
    exportClicks,
    deleteLink
} from '../controllers/link.controller.js';
import { healthCheck } from '../controllers/health.controller.js';

import { validateLink } from '../middleware/validateLink.middleware.js';

const router = Router();

router.get('/health', healthCheck);

router.post('/', validateLink, createLink);

router.get('/links/:code', getLinkInfo);

router.get('/links/:code/clicks', getClicksLog);

router.get('/links/:code/clicks.csv', exportClicks);

router.delete('/links/:code', deleteLink);

router.get('/:code', redirectLink);

export default router;