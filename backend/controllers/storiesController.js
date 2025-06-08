const Story = require('../models/Story');

// Obtener todas las historias
exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find();
    const formattedStories = stories.map((s) => ({
      ...s.toObject(),
      likedBy: s.likedBy || [],
    }));
    res.json(formattedStories);
  } catch (error) {
    console.error('Error al obtener historias:', error);
    res.status(500).json({ message: 'Error al obtener historias' });
  }
};

// Obtener una historia por ID ✅
exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Historia no encontrada' });
    }
    res.json({
      ...story.toObject(),
      likedBy: story.likedBy || [],
    });
  } catch (error) {
    console.error('Error al obtener historia por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear una nueva historia
exports.createStory = async (req, res) => {
  try {
    const user = req.user?.email;
    const { placeName, latitude, longitude, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Imagen requerida' });
    }

    if (!placeName || !latitude || !longitude) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const imagePath = req.file.path;

    const newStory = await Story.create({
      user,
      placeName,
      lat: parseFloat(latitude),
      lon: parseFloat(longitude),
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      imagePath,
    });

    res.status(201).json(newStory);
  } catch (error) {
    console.error('Error al crear historia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar una historia existente
exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Story.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Historia no encontrada' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar historia:', error);
    res.status(500).json({ message: 'Error al actualizar historia' });
  }
};

// Eliminar una historia
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Story.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Historia no encontrada' });
    }

    res.json({ message: 'Historia eliminada' });
  } catch (error) {
    console.error('Error al eliminar historia:', error);
    res.status(500).json({ message: 'Error al eliminar historia' });
  }
};

// Dar / quitar like a una historia
exports.likeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Spot no encontrado' });
    }

    const alreadyLiked = Array.isArray(story.likedBy) && story.likedBy.includes(userEmail);

    if (alreadyLiked) {
      story.likes -= 1;
      story.likedBy = story.likedBy.filter(email => email !== userEmail);
    } else {
      story.likes += 1;
      story.likedBy.push(userEmail);
    }

    await story.save();

    res.json({
      liked: !alreadyLiked,
      likes: story.likes,
    });
  } catch (error) {
    console.error('Error al dar/quitar like:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};





