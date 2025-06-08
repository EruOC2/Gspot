const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllStories,
  getStoryById,     // ✅ Agregado
  createStory,
  updateStory,
  deleteStory,
  likeStory,
} = require('../controllers/storiesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// 📌 Rutas
router.get('/', getAllStories);
router.get('/:id', authMiddleware, getStoryById); // ✅ Nueva ruta añadida
router.post('/', authMiddleware, upload.single('image'), createStory);
router.put('/:id', authMiddleware, updateStory);
router.delete('/:id', authMiddleware, deleteStory);
router.post('/:id/like', authMiddleware, likeStory);

module.exports = router;
