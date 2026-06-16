import express, {Router} from "express"
import { authMiddleware } from "../middlewares/authMiddleware"
import { addIncomeController, deleteIncome, getAllIncome, updateIncome } from "../controllers/incomeController.js"

const router = Router()

router.post("/", authMiddleware, addIncomeController)
router.get("/", authMiddleware, getAllIncome)
router.put("/:id", authMiddleware, updateIncome);
router.delete("/", authMiddleware, deleteIncome)

export default router