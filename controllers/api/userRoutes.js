const router = require('express').Router();
const { User } = require('../../models');

// POST Route for user registration
router.post('/', async (req, res) => {
  try {
    // Creating a new user with the provided data
    const userData = await User.create(req.body);

    // Saving user session after registration
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    // Handling registration errors
    res.status(400).json(err);
  }
});

// POST Route for user login
router.post('/login', async (req, res) => {
  try {
    // Finding a user with the provided username
    const userData = await User.findOne({ 
      where: { username: req.body.username } 
    });

    // If user data not found, return error
    if (!userData) {
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    // Checking if the provided password matches the stored password hash
    const validPassword = await userData.checkPassword(req.body.password);

    // If password is invalid, return error
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    // Saving user session after successful login
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    // Handling login errors
    res.status(400).json(err);
  }
});

// POST Route for user logout
router.post('/logout', (req, res) => {
  // Destroying the session upon logout
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    // If the user is not logged in, return a 404 error
    res.status(404).end();
  }
});

module.exports = router;
