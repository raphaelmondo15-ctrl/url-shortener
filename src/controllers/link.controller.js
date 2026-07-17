import { createShortLink, processRedirect } from '../services/link.service.js';

export const createLink = async (req, res) => {
    try {
        const { target_url } = req.validatedData;
        const newLink = await createShortLink(target_url);
        res.status(201).json(newLink);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOriginalLink = async (req, res) => {
    try {
        const { short_code } = req.params;
        const link = await processRedirect(short_code, {
            referrer: req.get('referer') || null,
            userAgent: req.get('user-agent') || null
        });

        res.redirect(link.target_url);
    } catch (error) {
        if (error.message === 'LINK_NOT_FOUND') {
            return res.status(404).json({ error: 'Link not found' });
        }

        if (error.message === 'LINK_EXPIRED') {
            return res.status(410).json({ error: 'Link has expired' });
        }

        res.status(500).json({ error: error.message });
    }
};

export const deleteLink = async (req, res) => {
    try {
        const { short_url } = req.params;
        const result = await deleteLinkByShortCode(short_url);

        res.status(200).json({ message: 'Link deleted successfully', result });
    } catch (error) {
        if (error.message === 'LINK_NOT_FOUND') {
            return res.status(404).json({ error: 'Link not found' });
        }

        res.status(500).json({ error: error.message });
    }
};