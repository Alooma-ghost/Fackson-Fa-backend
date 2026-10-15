import { Router, Request, Response } from 'express';
import { DataService } from '../config/dataService';

const router = Router();

// GET all news
router.get('/', async (req: Request, res: Response) => {
  try {
    const academy = req.query.academy as string | undefined;
    const query: any = {};
    if (academy) query.academy = academy;

    const newsList = await DataService.getNews(query);
    return res.json({ success: true, count: newsList.length, data: newsList });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST new article
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, excerpt, content, coverImage, academy, author, featured, category } = req.body;
    if (!title || !content || !coverImage) {
      return res.status(400).json({ success: false, message: 'Title, content and cover image are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const article = await DataService.addNews({
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE article
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    await DataService.deleteNews(id);
    return res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
