const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                User,
                {
                    model: Comment,
                    include: [User],
                },
            ]
        });
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: User,
                },
                {
                    model: Comment,
                    include: {
                        model: User,
                    },
                },
            ]
        })
        if (!postData) {
            res.status(404).json({ message: 'No Post found by that ID!' });
            return;
        }
        res.json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        const data = req.body;
        data.user_id = req.session.user_id;
        const postData = await Post.create(data);
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.put('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.update(req.body, {
            where: {
                id: req.params.id
            },
        })
        if (!postData) {
            res.status(404).json({ message: 'This Post does not exist' });
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.update({
            where: {
                id: req.params.id
            },
        })
        if (!postData) {
            res.status(404).json({ message: 'This Post does not exist' });
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
