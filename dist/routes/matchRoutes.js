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
        // Auto-publish match fixture as official news item so it shows everywhere in News
        try {
            const isHomeFackson = (homeTeam || '').toLowerCase().includes('fackson');
            const fixtureTypeStr = isHomeFackson ? 'Home Fixture' : 'Away Fixture';
            const divisionName = academy === 'angels' ? 'Fackson Angels (Female)' : 'Fackson Next Pro (Male)';
            const tierStr = category === 'free_age' ? 'Senior First Team' : category.toUpperCase();
            const newsTitle = `MATCH FIXTURE: ${homeTeam} vs ${awayTeam} (${gameType || '11 v 11'})`;
            const newsExcerpt = `${fixtureTypeStr} scheduled for ${date} at ${time}. Venue: ${venue || 'Meiran Field Estate'}. Competition: ${competition || 'Elite Championship'}.`;
            const newsContent = `OFFICIAL MATCH FIXTURE ANNOUNCEMENT\n\n` +
                `The academy management has confirmed the upcoming fixture:\n\n` +
                `• Fixture: ${homeTeam} vs ${awayTeam}\n` +
                `• Match Type: ${fixtureTypeStr}\n` +
                `• Competition: ${competition || 'Youth Elite Championship'}\n` +
                `• Game Format: ${gameType || '11 v 11'}\n` +
                `• Date: ${date}\n` +
                `• Kickoff Time: ${time} (WAT)\n` +
                `• Venue / Pitch: ${venue || 'Meiran Field Estate - Ojokoro Housing Estate Field, Meiran Alagbado'}\n` +
                `• Academy Squad: ${divisionName} [${tierStr}]\n` +
                `• Status: ${status ? status.toUpperCase() : 'UPCOMING'}\n\n` +
                `Parents, supporters, and international scouts are invited to attend. Real-time updates and scores will be broadcast pitchside.`;
            const coverImg = (isHomeFackson ? homeLogo : awayLogo) || homeLogo || awayLogo || (academy === 'angels' ? '/logos/fackson-angels.jpg' : '/logos/fackson-next-pro.jpg');
            await dataService_1.DataService.addNews({
                title: newsTitle,
                slug: `fixture-${homeTeam.toLowerCase().replace(/[^a-z0-9]/g, '-')}-vs-${awayTeam.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
                excerpt: newsExcerpt,
                content: newsContent,
                coverImage: coverImg,
                category: 'match_fixture',
                academy: academy,
                author: 'Fackson FA Matchday Desk',
                date: date || new Date().toISOString().split('T')[0],
                featured: true
            });
        }
        catch (newsErr) {
            console.error('Non-fatal error creating auto match news:', newsErr);
        }
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
        // If match finished or goes live, post match result news update
        if (req.body.status === 'completed' || req.body.status === 'live') {
            try {
                const isCompleted = req.body.status === 'completed';
                const newsTitle = isCompleted
                    ? `MATCH RESULT: ${updated.homeTeam} ${updated.homeScore} - ${updated.awayScore} ${updated.awayTeam}`
                    : `MATCH LIVE: ${updated.homeTeam} vs ${updated.awayTeam} (In Progress)`;
                const newsExcerpt = isCompleted
                    ? `Final Score: ${updated.homeTeam} ${updated.homeScore} - ${updated.awayScore} ${updated.awayTeam} in ${updated.competition}. Venue: ${updated.venue}.`
                    : `Live score update from ${updated.venue}: ${updated.homeScore} - ${updated.awayScore}.`;
                const newsContent = `MATCH REPORT\n\n` +
                    `• Fixture: ${updated.homeTeam} vs ${updated.awayTeam}\n` +
                    `• Score: ${updated.homeScore} - ${updated.awayScore}\n` +
                    `• Competition: ${updated.competition}\n` +
                    `• Format: ${updated.gameType || '11 v 11'}\n` +
                    `• Venue: ${updated.venue}\n` +
                    (updated.scorers && updated.scorers.length > 0 ? `• Scorers: ${updated.scorers.join(', ')}\n` : '');
                await dataService_1.DataService.addNews({
                    title: newsTitle,
                    slug: `report-${updated.homeTeam.toLowerCase().replace(/[^a-z0-9]/g, '-')}-vs-${updated.awayTeam.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
                    excerpt: newsExcerpt,
                    content: newsContent,
                    coverImage: updated.homeLogo || updated.awayLogo || '/logos/fackson-next-pro.jpg',
                    category: 'match_report',
                    academy: updated.academy,
                    author: 'Fackson FA Media',
                    date: updated.date || new Date().toISOString().split('T')[0],
                    featured: true
                });
            }
            catch (err) {
                console.error('Non-fatal error creating match update news:', err);
            }
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
