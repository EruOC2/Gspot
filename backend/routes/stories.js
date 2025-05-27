const express = require('express');
const multer = require('multer');
const { getAllStories, createStory } = require('../controllers/storiesController');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ importa middleware

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getAllStories);
router.post('/', authMiddleware, upload.single('image'), createStory); // ✅ protegido

module.exports = router;
