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

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check API and database health
 *     description: Returns the status of the API and PostgreSQL connection.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API and database are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 database:
 *                   type: string
 *                   example: connected
 *       503:
 *         description: Database unavailable
 */
router.get('/health', healthCheck);

/**
 * @openapi
 * /links:
 *   post:
 *     summary: Create a short URL
 *     description: Creates a short code for a given long URL.
 *     tags:
 *       - Links
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target_url
 *             properties:
 *               target_url:
 *                 type: string
 *                 example: https://github.com
 *               code:
 *                 type: string
 *                 example: my-github
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-31T23:59:59Z
 *     responses:
 *       201:
 *         description: Short link created successfully
 *       400:
 *         description: Invalid URL or invalid input
 *       409:
 *         description: Short code already exists
 */
router.post('/links', validateLink, createLink);

/**
 * @openapi
 * /links/{code}:
 *   get:
 *     summary: Get link metadata
 *     description: Returns information about a short link including click count and timestamps.
 *     tags:
 *       - Links
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Short URL code
 *         schema:
 *           type: string
 *           example: abc123
 *     responses:
 *       200:
 *         description: Link metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 code:
 *                   type: string
 *                   example: abc123
 *                 target_url:
 *                   type: string
 *                   example: https://github.com
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 expires_at:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 click_count:
 *                   type: integer
 *                   example: 25
 *       404:
 *         description: Link not found
 */
router.get('/links/:code', getLinkInfo);

/**
 * @openapi
 * /links/{code}/clicks:
 *   get:
 *     summary: Get click log
 *     description: Returns a paginated list of clicks for a short link using cursor-based pagination.
 *     tags:
 *       - Clicks
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Short URL code
 *         schema:
 *           type: string
 *           example: abc123
 *
 *       - in: query
 *         name: after
 *         required: false
 *         description: Cursor timestamp for the next page
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2026-07-23T10:30:00Z
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of clicks to return
 *         schema:
 *           type: integer
 *           example: 20
 *
 *     responses:
 *       200:
 *         description: Click log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       clicked_at:
 *                         type: string
 *                         format: date-time
 *                       referrer:
 *                         type: string
 *                         nullable: true
 *                       user_agent:
 *                         type: string
 *                         nullable: true
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *
 *       404:
 *         description: Link not found
 */
router.get('/links/:code/clicks', getClicksLog);

/**
 * @openapi
 * /links/{code}/clicks.csv:
 *   get:
 *     summary: Export click log as CSV
 *     description: Downloads the click history of a short link as a CSV file.
 *     tags:
 *       - Clicks
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Short URL code
 *         schema:
 *           type: string
 *           example: abc123
 *
 *     responses:
 *       200:
 *         description: CSV file containing click history
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: |
 *                 clicked_at,referrer,user_agent
 *                 2026-07-23T10:00:00Z,google.com,Mozilla
 *
 *       404:
 *         description: Link not found
 */
router.get('/links/:code/clicks.csv', exportClicks);

/**
 * @openapi
 * /links/{code}:
 *   delete:
 *     summary: Delete a short link
 *     description: Removes a short link and all associated clicks.
 *     tags:
 *       - Links
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Short URL code
 *         schema:
 *           type: string
 *           example: abc123
 *
 *     responses:
 *       204:
 *         description: Link deleted successfully
 *
 *       404:
 *         description: Link not found
 */
router.delete('/links/:code', deleteLink);

/**
 * @openapi
 * /{code}:
 *   get:
 *     summary: Redirect a short URL
 *     description: Redirects the visitor to the original URL and records the click.
 *     tags:
 *       - Redirect
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Short URL code
 *         schema:
 *           type: string
 *           example: abc123
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: Short code does not exist
 *       410:
 *         description: Link has expired
 */
router.get('/:code', redirectLink);

export default router;