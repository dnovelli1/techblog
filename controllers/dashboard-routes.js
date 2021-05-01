const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id,
            },
            include: [
                {
                    model: Comment,
                    include: {
                        model: User
                    },
                },
                {
                    model: User
                },
            ],
        })
        const posts = postData.map((post) => post.get({ plain: true }));
        res.render('dashboard', {
            posts,
            logged_in: true,
        }
        );
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: User
                },
                {
                    model: Comment,
                    include: {
                        model: User,
                    },
                },
            ],
        })
        const post = postData.get({ plain: true });
        res.render('updatepost', {
            post,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/createpost', withAuth, (req, res) => {
    res.render('create-post', {
        logged_in: true,
    });
});




module.exports = router;