"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const router = (0, express_1.Router)();
// GET all matches
router.get('/', async (req, res) => {
    try {
        const academy = req.query.academy;
        const category = req.query.category;
        const status = req.query.status;
        const query = {};
        if (academy)
            query.academy = academy;
        if (category)
            query.category = category;
        if (status)
            query.status = status;
        const matches = await dataService_1.DataService.getMatches(query);
        return res.json({ success: true, count: matches.length, data: matches });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// POST match
router.post('/', async (req, res) => {
    try {
        const { title, homeTeam, awayTeam, homeLogo, awayLogo, academy, category, date, time, venue, status, homeScore, awayScore, competition, gameType, scorers } = req.body;
        if (!homeTeam || !awayTeam || !academy || !category || !date || !time) {
            return res.status(400).json({ success: false, message: 'Please provide all mandatory match fields' });
        }
        const match = await dataService_1.DataService.addMatch({
            title: title || `${homeTeam} vs ${awayTeam}`,
            homeTeam,
            awayTeam,
            homeLogo: homeLogo || '',
            awayLogo: awayLogo || '',
            academy,
            category,
            date,
            time,
            venue: venue || 'Meiran Field Estate - Ojokoro Housing Estate Field, Meiran Alagbado',
            status: status || 'upcoming',
            homeScore: Number(homeScore) || 0,
            awayScore: Number(awayScore) || 0,
            competition: competition || 'Youth Elite Championship',
            gameType: gameType || '11 v 11',
            scorers: Array.isArray(scorers) ? scorers : typeof scorers === 'string' && scorers ? scorers.split(',').map((s) => s.trim()) : []
        });
        return res.status(201).json({ success: true, data: match });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// PUT update match (e.g. scores, status)
router.put('/:id', async (req, res) => {
    try {
        const id = req.params['id'];
        const updated = await dataService_1.DataService.updateMatch(id, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Match not found' });
        }
        return res.json({ success: true, data: updated });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// DELETE match
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params['id'];
        await dataService_1.DataService.deleteMatch(id);
        return res.json({ success: true, message: 'Match deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
