const User = require("../models/userModel");
const router = require("express").Router();

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const allfriends = await Promise.all(
      user.friends.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    allfriends.map((friend) => {
      const { _id, first_name, last_name, userImg } = friend;
      friendList.push({ _id, first_name, last_name, userImg });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});


//follow a user
router.put("/:id/acceptfriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id,
        {
          $push:{friends:req.body.userId}
        },{new:true});

        const userRequests = await User.findByIdAndUpdate(req.body.userId,
          {
            $pull: {friend_requests: req.params.id}
          },{new:true});
          console.log(userRequests);
        if(!userRequests){
          return res.status(403).json("you friend request not removed");
        }
      
      const sender = await User.findByIdAndUpdate(req.body.userId,
        {
          $push:{ friends: req.params.id },
        },{new:true})

        res.status(403).json("you friend request Accepted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});


//unfollow a user
router.put("/:id/blockfriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id,
        {
          $pull: { friends:req.body.userId }
        },{new:true});
      
        const sender = await User.findByIdAndUpdate(req.body.userId,
          {
            $pull: { friends: req.params.id}
          },{new:true});
      res.status(403).json("you remove friend ");
      
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});


// send Friend Request
router.put("/:id/sendfriendRequest", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            $push: {friend_requests: req.body.userId}
        },
        {new:true})

      if(!user){
        res.status(403).json("you cant unfollow yourself");
      }

      res.status(200).json("you send Friend Request");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});


// Remove Friend Request
router.put("/:id/removefriendRequest", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      // const currentUser = await User.findById(req.body.userId);
      if (user.friend_requests.includes(req.body.userId)) {
        await user.updateOne({ $pull: { friend_requests: req.body.userId } });
        
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});


module.exports = router;
