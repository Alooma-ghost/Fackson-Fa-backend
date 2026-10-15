"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const router = (0, express_1.Router)();
// GET all players (with optional filters: academy, category)
router.get('/', async (req, res) => {
    try {
        const academy = req.query.academy;
        const category = req.query.category;
        const query = {};
        if (academy)
            query.academy = academy;
        if (category)
            query.category = category;
        const players = await dataService_1.DataService.getPlayers(query);
        return res.json({ success: true, count: players.length, data: players });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// POST new player
router.post('/', async (req, res) => {
    try {
        const { name, academy, category, position, jerseyNumber, age, photoUrl, bio, stats, featured } = req.body;
        if (!name || !academy || !category || !position || !jerseyNumber) {
            return res.status(400).json({ success: false, message: 'Please provide all required player fields.' });
        }
        const player = await dataService_1.DataService.addPlayer({
            name,
            academy,
            category,
            position,
            jerseyNumber: Number(jerseyNumber),
            age: Number(age) || 16,
            photoUrl: photoUrl || '/images/default_player.jpg',
            bio: bio || '',
            stats: stats || { appearances: 0, goals: 0, assists: 0, cleanSheets: 0 },
            featured: Boolean(featured)
        });
        return res.status(201).json({ success: true, data: player });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// PUT update player
router.put('/:id', async (req, res) => {
    try {
        const id = req.params['id'];
        const updated = await dataService_1.DataService.updatePlayer(id, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Player not found' });
        }
        return res.json({ success: true, data: updated });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// DELETE player
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params['id'];
        await dataService_1.DataService.deletePlayer(id);
        return res.json({ success: true, message: 'Player deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
