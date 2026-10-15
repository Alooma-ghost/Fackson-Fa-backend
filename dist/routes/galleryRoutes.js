"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const router = (0, express_1.Router)();
// GET gallery items (filter by category, academy)
router.get('/', async (req, res) => {
    try {
        const category = req.query.category;
        const academy = req.query.academy;
        const query = {};
        if (category)
            query.category = category;
        if (academy)
            query.academy = academy;
        const items = await dataService_1.DataService.getGallery(query);
        return res.json({ success: true, count: items.length, data: items });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// POST picture/media item to gallery
router.post('/', async (req, res) => {
    try {
        const { title, caption, category, academy, imageUrl, tags } = req.body;
        if (!title || !imageUrl) {
            return res.status(400).json({ success: false, message: 'Title and Image URL are required' });
        }
        const item = await dataService_1.DataService.addGalleryItem({
            title,
            caption: caption || '',
            category: category || 'training',
            academy: academy || 'all',
            imageUrl,
            tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : []
        });
        return res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// DELETE gallery item
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params['id'];
        await dataService_1.DataService.deleteGalleryItem(id);
        return res.json({ success: true, message: 'Gallery item removed successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
