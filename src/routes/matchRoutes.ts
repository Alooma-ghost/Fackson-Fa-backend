import { Router, Request, Response } from 'express';
import { DataService } from '../config/dataService';

const router = Router();

// GET all matches
router.get('/', async (req: Request, res: Response) => {
  try {
    const academy = req.query.academy as string | undefined;
    const category = req.query.category as string | undefined;
    const status = req.query.status as string | undefined;
    const query: any = {};
    if (academy) query.academy = academy;
    if (category) query.category = category;
    if (status) query.status = status;

    const matches = await DataService.getMatches(query);
    return res.json({ success: true, count: matches.length, data: matches });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST match
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, homeTeam, awayTeam, homeLogo, awayLogo, academy, category, date, time, venue, status, homeScore, awayScore, competition } = req.body;
    if (!homeTeam || !awayTeam || !academy || !category || !date || !time) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory match fields' });
    }

    const match = await DataService.addMatch({
      title: title || `${homeTeam} vs ${awayTeam}`,
      homeTeam,
      awayTeam,
      homeLogo: homeLogo || '',
      awayLogo: awayLogo || '',
      academy,
      category,
      date,
      time,
      venue: venue || 'Fackson Academy Stadium Complex',
      status: status || 'upcoming',
      homeScore: Number(homeScore) || 0,
      awayScore: Number(awayScore) || 0,
      competition: competition || 'Youth Elite Championship'
    });

    return res.status(201).json({ success: true, data: match });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update match (e.g. scores, status)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const updated = await DataService.updateMatch(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE match
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await DataService.deleteMatch(id);
    return res.json({ success: true, message: 'Match deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
