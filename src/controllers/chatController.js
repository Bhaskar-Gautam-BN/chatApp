import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";
const accessChat = async (req, res) => {
  const { userId } = req.body;
  console.log(req.user,'====>>>>>>>>>>>>');
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
    // select:"-password"
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChatData = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).send(FullChatData);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

export default accessChat;
