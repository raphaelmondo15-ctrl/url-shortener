import {
    createLink as createLinkService,
    processRedirect,
    deleteLinkByCode,
    getLinkMetadata,
    getClickLogForExport
} from '../services/link.service.js';
import { toCSV } from '../utils/csv.js';

export const createLink = async (req, res) => {
    try {
        const { target_url, code, expires_at } = req.validatedData;

        const newLink = await createLinkService({
            target_url,
            code,
            expires_at
        });

        return res.status(201).json(newLink);

    } catch (error) {

        if (error.message === 'CODE_ALREADY_EXISTS') {
            return res.status(409).json({
                error: 'Code already taken'
            });
        }

        return res.status(500).json({
            error: error.message
        });
    }
};

export const redirectLink = async (req, res) => {
    try {
        const { code } = req.params;

        const link = await processRedirect(code, {
            referrer: req.get('referer') || null,
            userAgent: req.get('user-agent') || null
        });

        return res.redirect(302, link.target_url);

    } catch (error) {

        if (error.message === 'LINK_NOT_FOUND') {
            return res.status(404).json({
                error: 'Link not found'
            });
        }

        if (error.message === 'LINK_EXPIRED') {
            return res.status(410).json({
                error: 'Link has expired'
            });
        }

        return res.status(500).json({
            error: error.message
        });
    }
};

export const deleteLink = async (req, res) => {
    try {
        const { code } = req.params;

        await deleteLinkByCode(code);

        return res.sendStatus(204);

    } catch (error) {

        if (error.message === 'LINK_NOT_FOUND') {
            return res.status(404).json({
                error: 'Link not found'
            });
        }

        return res.status(500).json({
            error: error.message
        });
    }
};

export const getLinkInfo = async (req, res) => {
    try {
        const { code } = req.params;

        const link = await getLinkMetadata(code);

        return res.status(200).json(link);

    } catch (error) {

        if (error.message === 'LINK_NOT_FOUND') {
            return res.status(404).json({
                error: 'Link not found'
            });
        }

        return res.status(500).json({
            error: error.message
        });
    }
};

export const getClicksLog = async (req, res) => {
    try {
        const { code } = req.params;
        const { after, limit } = req.query;

        const clicks = await getClicksLog(code, after, limit);

        return res.status(200).json(clicks);

    } catch (error) {

        if (error.message === 'LINK_NOT_FOUND') {
            return res.status(404).json({
                error: 'Link not found'
            });
        }

        return res.status(500).json({
            error: error.message
        });
    }
}
 
export const exportClicks = async (req, res) => {
    try {
        const { code } = req.params;

        const clicks = await getClickLogForExport(code);

        const csv = toCSV(clicks);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${code}_clicks.csv"`); 
        return res.status(200).send(csv);
    } catch (error) {
        if (error.message === 'LINK_NOT_FOUND') {
            return res.status(404).json({
                error: 'Link not found'
            });
        }

        return res.status(500).json({
            error: error.message
        });
    }
}