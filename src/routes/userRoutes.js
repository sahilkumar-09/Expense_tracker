import express from "express"
import { userLoginController, userRegisterController, getMeController, logoutController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/register", userRegisterController);
router.post("/login", userLoginController)
router.get("/me", authMiddleware, getMeController)
router.post("/logout", authMiddleware, logoutController)

export default router