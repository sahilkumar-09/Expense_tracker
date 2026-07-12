import express, {Router} from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { addIncomeController, deleteIncome, downloadIncomeExcel, getAllIncome, getIncomeOverview, updateIncome } from "../controllers/incomeController.js"

const router = Router()

router.post("/add", authMiddleware, addIncomeController)
router.get("/", authMiddleware, getAllIncome)
router.put("/update/:id", authMiddleware, updateIncome);
router.delete("/delete/:id", authMiddleware, deleteIncome)
router.get("/downloadexcel", authMiddleware, downloadIncomeExcel)
router.get("/overview", authMiddleware, getIncomeOverview)

export default router