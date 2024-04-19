// Importing router from Express, comment model and middleware for authentication
const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET Route to get all comments
router.get('/', (req, res) => {
    Comment.findAll({})
        .then(commentData => res.json(commentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET Route to get a specific comment by ID
router.get('/:id', (req, res) => {
    Comment.findAll({ 
        where: {
            // Filtering by the ID parameter
            id: req.params.id 
        }
    })
        .then(commentData => res.json(commentData))
        .catch(err => { 
            console.log(err);
            res.status(500).json(err);
        });
});

// POST Route to create a new comment
router.post('/', async (req, res) => {
    try {
        const newComment = await Comment.create({ // Creating a new comment
            ...req.body, // Including data from the request body
            user_id: req.session.user_id, // Setting the user ID from the session
        });
        res.json(newComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE Route to delete a comment by ID
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({ // Deleting the comment
            where: {
                id: req.params.id, // Filtering by the ID parameter from the request
                user_id: req.session.user_id, // Ensuring that the user owns the comment by checking the session user ID
            },
        });
        if (!commentData) {
            res.status(404).json({ message: '404 Blog ID not found' });
            return;
        }
        res.status(200).json(commentData); 
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
