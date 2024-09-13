import { json } from "express";
import generateToken from "../config/generateToken.js";
import User from "../models/userModel.js";

const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(404).json({error:"please fill the all field "});
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({error:"user already exists"});
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user),
    });
  } else {
    res.status(400);
    throw new Error("failed to create user");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user &&  user.password == password) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user),
    });
  } else {
    res.status(401);
    json({error:"invalid email or password"});
  }
};
const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};
  const users = await User.find(keyword).select("-password");
  // const users =await User.find(keyword).find({_id:{$ne:req.user._id}})
  res.send(users);
};

export { registerUser, allUsers, loginUser };
