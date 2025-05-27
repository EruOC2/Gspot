const Story = require('../models/Story');

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las historias' });
  }
};

exports.createStory = async (req, res) => {
  const { latitude, longitude } = req.body;
  const user = req.user.email;

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  try {
    const story = await Story.create({
      user,
      imageUrl,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    });

    res.json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la historia' });
  }
};
