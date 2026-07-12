import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/DateFilter.js";
import XLSX from "xlsx"

export async function addExpense(req, res) {
  const userid = req.user._id;
  const { description, category, amount, date } = req.body;

  if (!description || !category || !amount || !date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
    }
    
    const newExpense = await expenseModel.create({
        user: userid,
        description,
        amount,
        category,
        date: new Date(date)
   }) 

    await newExpense.save()

    return res.status(201).json({
        success: false,
        message: "Expense added successfully",
        expense: newExpense
    })
}

export async function allExpense(req, res) {
    const userid = req.user._id
    const expense = await expenseModel.find({user: userid}).sort({date: -1})
    return res.status(200).json({
        success: true,
        message: "All expense fetched successfully",
        expense
    })
}

export async function updateExpense(req, res) {
    const { id } = req.params;

    const userid = req.user._id;

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const { description, amount, category, date } = req.body;

    const updateExpense = await expenseModel.findOneAndUpdate(
      {
        _id: id,
        user: userid,
      },
      {
        description,
        amount,
        category,
        date,
      },
      {
        new: true,
      },
    );
    if (!updateExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized to update it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updateExpense
    });
}

export async function deleteExpense(req, res) {
    
  const userid = req.user._id;
  const { id } = req.params;

  if (!userid) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const deletedExpense = await expenseModel.findByIdAndDelete({
    _id: id,
    userid,
  });
  if (!deletedExpense) {
    return res.status(404).json({
      success: false,
      message: "Expense not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
}

export async function downloadExpense(req, res) {
    
  const userid = req.user._id;
  const expense = await expenseModel.find({ user: userid }).sort({ date: -1 });

  const plainData = expense.map((exp) => ({
    Description: exp.description,
    Amount: exp.amount,
    Category: exp.category,
    Date: new Date(exp.date).toLocaleDateString(),
  }));

  const workSheet = XLSX.utils.json_to_sheet(plainData);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "expenseModel");
  XLSX.writeFile(workBook, "expense_detail.xlsx");
  res.download("expense_detail.xlsx");
}

export async function getExpenseOverview(req, res) {
    
  const userid = req.user._id;
  const { range = "monthly" } = req.query;

  const { start, end } = getDateRange(range);

  const expense = await expenseModel
    .find({ user: userid, date: { $gte: start, $lte: end } })
    .sort({ date: -1 });

  const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
  const averageExpense = expense.length > 0 ? totalExpense / expense.length : 0;
  const numberOfTransactions = expense.length;
    const recentTransactions = expense.slice(0, 5)
  res.status(200).json({
    success: true,
    data: {
      totalExpense,
      averageExpense,
      numberOfTransactions,
      recentTransactions,
      range,
    },
  });

}