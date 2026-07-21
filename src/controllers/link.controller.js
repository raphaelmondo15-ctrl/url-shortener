import {
    createLink as createLinkService,
    processRedirect,
    deleteLinkByCode,
    getLinkMetadata,
    getClickslog
} from '../services/link.service.js';

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

export const getClickslog = async (req, res) => {
    try {
        const { code } = req.params;

        const clicks = await getClickslog(code);

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
};
    