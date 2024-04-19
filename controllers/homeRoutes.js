// Importing router, models and middleware
const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET Route for the homepage
router.get('/', async (req, res) => {
	try {
		const blogData = await Blog.findAll({
			include: [{
				model: User,
				attributes: ['username'],
			},],
		});

		const blogs = blogData.map((blog) => blog.get({
			plain: true
		}));

		// Rendering the homepage template with blogs data and logged_in status
		res.render('homepage', {
			blogs,
			logged_in: req.session.logged_in
		});
	} catch (err) {
		// Handling errors with a 500 status and returning JSON
		res.status(500).json(err);
	}
});

// GET Route for displaying a specific blog
router.get('/blog/:id', async (req, res) => {
	try {
		// Finding a blog by its primary key (id) and including associated user and comments
		const blogData = await Blog.findByPk(req.params.id, {
			include: [
				{
					model: User,
					attributes: ['username'],
				}, {
					model: Comment,
					include: [
						User
					]
				}
			],
		});

		// Getting the plain object representation of the blog
		const blog = blogData.get({
			plain: true
		});

		// Rendering the blog template with blog data and logged_in status
		res.render('blog', {
			...blog,
			logged_in: req.session.logged_in
		});
	} catch (err) {
		// Handling errors with a 500 status and returning JSON
		res.status(500).json(err);
	}
});

// GET Route for the dashboard page, requires authentication
router.get('/dashboard', withAuth, async (req, res) => {
	try {
		// Finding user data by primary key and including associated blogs
		const userData = await User.findByPk(req.session.user_id, {
			attributes: {
				exclude: ['password']
			},
			include: [{
				model: Blog
			}],
		});

		// Getting the plain object representation of the user
		const user = userData.get({
			plain: true
		});

		// Rendering the dashboard template with user data and logged_in status
		res.render('dashboard', {
			...user,
			logged_in: true
		});
	} catch (err) {
		// Handling errors with a 500 status and returning JSON
		res.status(500).json(err);
	}
});

// GET Route for the login page
router.get('/login', (req, res) => {
	// Redirecting to the dashboard if already logged in
	if (req.session.logged_in) {
		res.redirect('/dashboard');
		return;
	}

	// Rendering the login template
	res.render('login');
});

// Route for the sign-up page
router.get('/signUp', (req, res) => {
	// Redirecting to the dashboard if already logged in
	if (req.session.logged_in) {
		res.redirect('/dashboard');
		return;
	}
	
	// Rendering the sign-up template
	res.render('signUp');
});

module.exports = router;
