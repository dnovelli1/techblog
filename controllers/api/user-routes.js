const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Finds all users
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: {
                exclude: ['password'], //Excludes the password to avoid corruption
            },
        })
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Finds one user
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findOne({
            attributes: {
                exclude: ['password'], //Excludes the password to avoid corruption
            },
            where: {
                id: req.params.id, // where the id requested matches the id stored in the db
            },
            include: [
                {
                    model: Post, //Includes the users associated posts
                },
                {
                    model: Comment, 
                    include: { //includes the comments and user model associated to the comments
                        model: User,
                    },
                },
            ],
        })
        if (!userData) { // If no user exists
            res.status(400).json({ message: 'No data found by that ID!' });
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});




// Creates a new user
router.post('/', withAuth, async (req, res) => {
    try {
        const userData = await User.create({ 
            username: req.body.username, //Takes the username requested, sets as username in db
            password: req.body.password, //Takes the password requested, sets as username in db
        });

        req.session.save(() => {
            req.session.user_id = userData.id; // Sets session id to the user id
            req.session.username = userData.username; // Sets session username to the user's username
            req.session.logged_in = true; // Sets the logged_in status tot rue, the user is logged in
            res.status(200).json(userData);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// / Logs in a user
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {
                username: req.body.username, //matches username entered to the username stored in the db
            },
        });
        if (!userData) { //if no username exists
            res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
            return;
        }
        const validPassword = await userData.checkPassword(req.body.password); //Checks the password entered to the encrypted version stored
        if (!validPassword) { // If the password does not match
            res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id; //Saves the session id as the user's id
            req.session.username = userData.username; //Saves the sessions username as the user's username
            req.session.logged_in = true; //Sets logged_in status to true
            res.status(200).json({ user: userData, message: 'You are now logged in!' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Logs a user out
router.post('/logout', (req, res) => {
    if (req.session.logged_in) { //if clicked while they are logged in
        req.session.destroy(() => {
            res.status(204).end(); // Ends the current session
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
