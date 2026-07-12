import express, { Router } from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addExpense,
  deleteExpense,
  downloadExpense,
  allExpense,
  getExpenseOverview,
  updateExpense,
} from "../controllers/expenseController.js";

const router = Router()

router.post("/add", authMiddleware, addExpense);
router.get("/", authMiddleware, allExpense)
router.put("/update/:id", authMiddleware, updateExpense);
router.delete("/delete/:id", authMiddleware, deleteExpense);
router.get("/downloadexcel", authMiddleware, downloadExpense);
router.get("/overview", authMiddleware, getExpenseOverview);

export default router