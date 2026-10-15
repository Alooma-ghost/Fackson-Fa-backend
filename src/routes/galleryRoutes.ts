import { Router, Request, Response } from 'express';
import { DataService } from '../config/dataService';

const router = Router();

// GET gallery items (filter by category, academy)
router.get('/', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const academy = req.query.academy as string | undefined;
    const query: any = {};
    if (category) query.category = category;
    if (academy) query.academy = academy;

    const items = await DataService.getGallery(query);
    return res.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST picture/media item to gallery
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, caption, category, academy, imageUrl, tags } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Title and Image URL are required' });
    }

    const item = await DataService.addGalleryItem({
      title,
      caption: caption || '',
      category: category || 'training',
      academy: academy || 'all',
      imageUrl,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : []
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE gallery item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await DataService.deleteGalleryItem(id);
    return res.json({ success: true, message: 'Gallery item removed successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
