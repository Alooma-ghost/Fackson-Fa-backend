import { Router, Request, Response } from 'express';
import { DataService } from '../config/dataService';

const router = Router();

// GET all registrations (admin only)
router.get('/', async (req: Request, res: Response) => {
  try {
    const list = await DataService.getRegistrations();
    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST new player registration / trial booking (public form)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      playerName,
      dateOfBirth,
      gender,
      academyPreference,
      category,
      parentName,
      phone,
      email,
      address,
      position,
      experience
    } = req.body;

    if (!playerName || !dateOfBirth || !gender || !academyPreference || !category || !phone || !email || !position) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const reg = await DataService.addRegistration({
      playerName,
      dateOfBirth,
      gender,
      academyPreference,
      category,
      parentName: parentName || '',
      phone,
      email,
      address: address || '',
      position,
      experience: experience || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully! Our coaching staff will contact you shortly.',
      data: reg
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH registration status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const { status } = req.body;
    const updated = await DataService.updateRegistrationStatus(id, status as string);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
