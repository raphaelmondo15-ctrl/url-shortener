import { createShortLink } from '../services/link.service.js';

export const createLink = async (req, res) => {
    try {
        const { target_url } = req.body;
        const newLink = await createShortLink(target_url);
        res.status(201).json(newLink);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOriginalLink = async (req, res) => {
    try {
        const { short_code } = req.params;
        const link = await getLinkByShortCode(short_code);

        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }

        res.redirect(link.target_url);
    } catch (error) {
        if (error.message === 'Link has expired') {
            return res.status(410).json({ error: 'Link has expired' });
        }
        res.status(500).json({ error: error.message });
    }
}