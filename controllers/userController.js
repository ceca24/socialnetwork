const { User, Thought } = require("../models");

const userController = {
 
  getAllUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  
  createNewUser(req, res) {
    User.create(req.body)
      .then((newUser) => res.json(newUser))
      .catch((err) => res.status(500).json(err));
  },

  
  updateUser(req, res) {
    User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .then((user) => {
        !user
          ? res.status(404).json({ message: "User not found." })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },


  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found." })
          : Thought.deleteMany({
              _id: {
                $in: user.thoughts,
              },
            })
      )
      .then(() => res.json({ message: "User Deleted" }))
      .catch((err) => res.status(500).json(err));
  },
 
  addFriend(req, res) {
    User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $addToSet: {
          friends: req.params.friendsId,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "User not found." });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

 
  removeFriend(req, res) {
    User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $pull: {
          friends: req.params.friendsId,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;