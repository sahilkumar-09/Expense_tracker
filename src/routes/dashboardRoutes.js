import express from "express"

import { getDashBoardOverview } from "../controllers/dashboardController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const dashboardRouter = express.Router()

dashboardRouter.get("/", authMiddleware, getDashBoardOverview)

export default dashboardRouter;