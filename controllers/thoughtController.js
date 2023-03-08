const { Thought } = require('../models/Thought');
const { User } = require('../models/User');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then((thoughts) => res.json(thoughts))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one thought by id
    getSingleThought(req, res) {

        Thought.findOne({ _id: req.params.id }).populate({path: 'username'})
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({ message: 'No thoughts! Head Empty!' });
                    return;
                }
                res.json(thought);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // create thought
    createThought(req, res) {
        Thought.create(req.body)
            .then(({thought}) => {
                return User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then((userData) => res.json(userData))
                .catch((err) => res.status(404).json({ message: 'No thoughts! Head Empty!' }));
    },

    // update thought by id
    updateThought(req, res) {
        Thought.findByIdAndUpdate(
            { _id: req.params.id },
            
            $set: req.body,
            
            { runValidators: true, new: true }

        )
            .then((thought) => {
                !thought
                    ? res.status(404).json({ message: 'No thoughts! Head Empty!' })
                    : res.json(thought);
            })
            .catch((err) => res.status(400).json(err));
    },

    // delete thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({ message: 'No thoughts! Head Empty!' });
                    return;
                }

                return User.findOneAndUpdate(
                    { thoughts: req.params.userId },
                    { $pull: { thoughts: req.params.id } },
                    { new: true }
                );
            })
            .then((userData) => {
                if (!userData) {
                    return res.status(404).json({ message: 'No user here!' }) }
                res.json ({ message: 'Thought deleted!' });})}
            },