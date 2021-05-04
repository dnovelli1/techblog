const router = require('express').Router();
const { User, Comment, Post} = require('../models');
const withAuth = require('../utils/auth');

// Renders all posts to the homepage
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User, //Includes the user associated to each post
                },
                {
                    model: Comment, // Includes the comments associated to each post
                    include: {
                        model: User, //Includes the user associated to the comments
                    },
                },
            ],
        });
        const posts = postData.map((post) => post.get({ plain: true })); 
        res.render('homepage', { //renders the posts to the homepage handlebar
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
// If a user is logged in they are redirected to their dashboard, otherwise renders the login page
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});

// Renders the signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// When a user clicks a specific post, this is the response
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id, //Matches the id clicked to the post id in the db
            },
            include: [
                {
                    model: Comment, //Includes the comments associated to the post
                    include: {
                        model: User, //Includes the user associated to the comment
                    },
                },
                {
                    model: User, //Includes the user associated to the post
                },
            ],
        });
        if (!postData) { // If no post id found
            res.status(404).json({ message: 'No Post found by that ID!' });
            return;
        }
        const post = postData.get({ plain: true });
        res.render('onepost', { //Redners the post to the onepost handlebar
            post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Renders the dashboard page
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, { // Finds the user by the current session id of whoever is logged in
            attributes: { exclude: ['password'] }, //Excludes the password for user protection
            include: [{ model: Post }], // Includes the posts of the user
        });

        const user = userData.get({ plain: true }); //Formats the data as plain text

        res.render('dashboard', { //Renders all user posts to the dashboard handlebar
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;