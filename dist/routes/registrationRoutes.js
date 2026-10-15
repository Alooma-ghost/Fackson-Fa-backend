"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataService_1 = require("../config/dataService");
const router = (0, express_1.Router)();
// GET all registrations (admin only)
router.get('/', async (req, res) => {
    try {
        const list = await dataService_1.DataService.getRegistrations();
        return res.json({ success: true, count: list.length, data: list });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// POST new player registration / trial booking (public form)
router.post('/', async (req, res) => {
    try {
        const { playerName, dateOfBirth, gender, academyPreference, category, parentName, phone, email, address, position, experience } = req.body;
        if (!playerName || !dateOfBirth || !gender || !academyPreference || !category || !phone || !email || !position) {
            return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
        }
        const reg = await dataService_1.DataService.addRegistration({
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// PATCH registration status
router.patch('/:id/status', async (req, res) => {
    try {
        const id = req.params['id'];
        const { status } = req.body;
        const updated = await dataService_1.DataService.updateRegistrationStatus(id, status);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }
        return res.json({ success: true, data: updated });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
