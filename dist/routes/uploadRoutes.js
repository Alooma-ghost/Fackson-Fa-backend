"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const getUploadDir = () => {
    const dir1 = path_1.default.resolve(__dirname, '../../uploads');
    const dir2 = path_1.default.resolve(process.cwd(), 'uploads');
    const dir = fs_1.default.existsSync(dir1) ? dir1 : dir2;
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    return dir;
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getUploadDir());
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const uniqueName = `fackson_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|svg/;
        const extname = allowed.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowed.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, SVG) are allowed!'));
    }
});
// Single image upload
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file uploaded' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        return res.json({
            success: true,
            url: fileUrl,
            filename: req.file.filename,
            size: req.file.size
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
// Multiple images upload
router.post('/multiple', upload.array('images', 10), (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'No images uploaded' });
        }
        const urls = files.map(file => `/uploads/${file.filename}`);
        return res.json({
            success: true,
            urls
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
