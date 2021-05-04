const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Finds all posts to render on the dashboard, with authorization
router.get('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id, // finds the posts where the user id matches the current session id
            },
            include: [
                {
                    model: Comment, //includes the comments associated to each post
                    include: {
                        model: User //includes the user associated to each comment
                    },
                },
                {
                    model: User //includes the user associated to the post
                },
            ],
        })
        const posts = postData.map((post) => post.get({ plain: true }));
        res.render('dashboard', { //Renders the data on the dashoboard handlebar
            posts,
            logged_in: true,
        }
        );
    } catch (err) {
        res.status(500).json(err);
    }
});

// Takes the user to the specific post in order to edit the post
router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id, // Matches the post to the id requested
            },
            include: [
                {
                    model: User //Includes the user associated to the post
                },
                {
                    model: Comment, //Includes the comments associated to the post and the user associated to the comments
                    include: {
                        model: User,
                    },
                },
            ],
        })
        const post = postData.get({ plain: true });
        res.render('updatepost', { //Renders the data to the update post handlebar
            post,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Takes the user to the createpost handlebar if they are logged in
router.get('/createpost', withAuth, (req, res) => {
    res.render('create-post', {
        logged_in: true,
    });
});




module.exports = router;