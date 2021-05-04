const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Find all comments
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll();
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// If auth passes, move to create new comment with the body of the comment
router.post('/', withAuth, async (req, res) => {
// router.post('/',  async (req, res) => {
    // User is logged into a session
    if (req.session) {
        try {
            const commentData = await Comment.create({
                comment_body: req.body.comment_body,
                post_id: req.body.post_id, //on the associated post _id
                user_id: req.session.user_id, // with the associated user making the comment
            })
            res.status(200).json(commentData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        };
    };
});



router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id, // Delete a specific comment.
            },
        })
        if (!commentData) { // if no comment exists, throw this message.
            res.status(404).json({ message: 'No Comment with that ID!' });
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;