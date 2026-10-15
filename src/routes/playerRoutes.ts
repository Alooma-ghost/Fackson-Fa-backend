import { Router, Request, Response } from 'express';
import { DataService } from '../config/dataService';

const router = Router();

// GET all players (with optional filters: academy, category)
router.get('/', async (req: Request, res: Response) => {
  try {
    const academy = req.query.academy as string | undefined;
    const category = req.query.category as string | undefined;
    const query: any = {};
    if (academy) query.academy = academy;
    if (category) query.category = category;

    const players = await DataService.getPlayers(query);
    return res.json({ success: true, count: players.length, data: players });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST new player
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, academy, category, position, jerseyNumber, age, photoUrl, bio, stats, featured } = req.body;
    if (!name || !academy || !category || !position || !jerseyNumber) {
      return res.status(400).json({ success: false, message: 'Please provide all required player fields.' });
    }

    const player = await DataService.addPlayer({
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update player
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const updated = await DataService.updatePlayer(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE player
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await DataService.deletePlayer(id);
    return res.json({ success: true, message: 'Player deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
