export function validateLink(req, res, next) {
    const { target_url } = req.body;
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

    if (!urlPattern.test(target_url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    next();
}