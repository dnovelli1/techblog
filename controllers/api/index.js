const router = require('express').Router();

// Setting requirements for each route
const userRoutes = require('./user-routes');
const commentRoutes = require('./comment-routes');
const postRoutes = require('./post-routes');

// Router will establish these routes for each api route
router.use('/user', userRoutes);
router.use('/comment', commentRoutes);
router.use('/post', postRoutes);


module.exports = router;