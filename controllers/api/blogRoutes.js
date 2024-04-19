// Importing router from Express, blog model and middleware for authentication
const router = require('express').Router();
const { Blog } = require('../../models');
const withAuth = require('../../utils/auth');

// POST Route to create a new blog post
router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({ // Creating a new blog post
      ...req.body, // Including data from the request body
      user_id: req.session.user_id, // Setting the user ID from the session
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE Route to delete a blog post by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id, // Filtering by the ID parameter from the request
        user_id: req.session.user_id, // Ensuring that the user owns the blog post by checking the session user ID
      },
    });

    if (!blogData) {
      res.status(404).json({ message: '404 Blog ID not found' });
      return;
    }

    res.status(200).json(blogData); 
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
