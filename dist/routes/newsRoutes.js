"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const router = (0, express_1.Router)();
// GET all news
router.get('/', async (req, res) => {
    try {
        const academy = req.query.academy;
        const query = {};
        if (academy)
            query.academy = academy;
        const newsList = await dataService_1.DataService.getNews(query);
        return res.json({ success: true, count: newsList.length, data: newsList });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// POST new article
router.post('/', async (req, res) => {
    try {
        const { title, excerpt, content, coverImage, academy, author, featured, category } = req.body;
        if (!title || !content || !coverImage) {
            return res.status(400).json({ success: false, message: 'Title, content and cover image are required' });
        }
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
        const article = await dataService_1.DataService.addNews({
            title,
            slug,
            excerpt: excerpt || content.substring(0, 160) + '...',
            content,
            coverImage,
            category: category || 'match',
            academy: academy || 'all',
            author: author || 'Fackson Media Team',
            date: new Date().toISOString().split('T')[0],
            featured: Boolean(featured)
        });
        return res.status(201).json({ success: true, data: article });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// DELETE article
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params['id'];
        await dataService_1.DataService.deleteNews(id);
        return res.json({ success: true, message: 'Article deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
