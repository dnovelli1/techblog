const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Find all posts in the db
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                User, //including the associated user on the posts
                {
                    model: Comment, // Includes the comment of the post
                    include: [User], // and the user associated to the comments
                },
            ]
        });
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//  find a specific post
router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id, // Finds the post with the specific id requested.
            },
            include: [
                {
                    model: User, // Includes the user associated to the post
                },
                {
                    model: Comment, // Includes the comments associated to the post
                    include: {
                        model: User, // Includes the user associated to the comments
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

// Create a new post
router.post('/', withAuth, async (req, res) => {
    try {
        const data = req.body; //Takes the body of the post
        console.log(data);
        data.user_id = req.session.user_id; // Sets the user id according to the session id
        const postData = await Post.create(data); //Creates the post combining the body and associated user id
        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Updates the specific post
router.put('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.update(req.body, { //updates the posts req.body
            where: { 
                id: req.params.id // Where the id matches the id requested
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

// Deleting a specific post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({ 
            where: {
                id: req.params.id // where the id requested matches the id in the database
            },
        });
        if (!postData) {
            res.status(404).json({ message: 'This Post does not exist' });
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
