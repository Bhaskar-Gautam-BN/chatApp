import express from "express";
import { registerUser, allUsers, loginUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser);

router.route("/all").get(authMiddleware, allUsers);
router.route("/login").post(loginUser);
// router.route("/all").get(authMiddleware, allUsers);

export default router;
