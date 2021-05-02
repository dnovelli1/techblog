const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', async (req, res) => {
    try {const commentData = await Comment.findAll();
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('/', withAuth, async (req, res) => {
    if (req.session) {
        try {
            const commentData = await Comment.create({
                body: req.body.body,
                post_id: req.body.post_id,
                user_id: req.session.user_id,
            })
            res.status(200).json(commentData);
        } catch (err) {
            res.status(500).json(err);
        };
    };
});



router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
            },
        })
        if (!commentData) {
            res.status(404).json({ message: 'No Comment with that ID!' });
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;