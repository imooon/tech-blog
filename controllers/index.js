// Import modules
const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes.js');

// Set up routes
router.use('/api', apiRoutes);
router.use("/", homeRoutes);

// Export router
module.exports = router;
