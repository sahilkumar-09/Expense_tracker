import express from "express"
import { userRegisterController } from "../controllers/authController.js";

const router = express.Router()

router.post("/register", userRegisterController);

export default router