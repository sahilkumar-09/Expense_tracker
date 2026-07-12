import XLSX from "xlsx";
import incomeModel from "../models/incomeModel.js";
import getDateRange from "../utils/DateFilter.js";

export async function addIncomeController(req, res) {
  const user = req.user._id;
  const { description, category, amount, date } = req.body;

  if (!description || !category || !amount || !date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const newIncome = await incomeModel.create({
    user,
    description,
    category,
    amount,
    date: new Date(date),
  });

  if (!newIncome) {
    return res.status(404).json({
      success: false,
      message: "Income not created",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Income created successfully",
    income: newIncome,
  });
}

export async function getAllIncome(req, res) {
  const userid = req.user._id;

  const income = await incomeModel.find({ user: userid }).sort({ date: -1 });

  return res.status(200).json({
    success: true,
    message: "Income fetched successfully",
    income,
  });
}

export async function updateIncome(req, res) {
  const { id } = req.params;

  const userid = req.user._id;

  if (!userid) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const { description, amount, category, date} = req.body;

  const updateIncome = await incomeModel.findOneAndUpdate(
    {
      _id: id,
      user: userid
    },
    {
      description,
      amount,
      category,
      date
    },
    {
      new: true,
    }
  );
   if (!updateIncome) {
     return res.status(404).json({
       success: false,
       message: "Income not found or you are not authorized to update it.",
     });
   }

  return res.status(200).json({
    success: true,
    message: "Income updated successfully",
    income: updateIncome,
  });
}

export async function deleteIncome(req, res) {
  const userid = req.user._id;
  const { id } = req.params;

  if (!userid) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const deletedIncome = await incomeModel.findByIdAndDelete({
    _id: id,
    userid,
  });
  if (!deletedIncome) {
    return res.status(404).json({
      success: false,
      message: "Income not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Income deleted successfully",
  });
}

export async function downloadIncomeExcel(req, res) {
  const userid = req.user._id;
  const income = await incomeModel.find({ user: userid }).sort({ date: -1 });

  const plainData = income.map((inc) => ({
    Description: inc.description,
    Amount: inc.amount,
    Category: inc.category,
    Date: new Date(inc.date).toLocaleDateString(),
  }));

  const workSheet = XLSX.utils.json_to_sheet(plainData);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "incomeModel");
  XLSX.writeFile(workBook, "income_details.xlsx");
  res.download("income_details.xlsx");
}

export async function getIncomeOverview(req, res) {
  const userid = req.user._id;
  const { range = "monthly" } = req.query;

  const { start, end } = getDateRange(range);

  const incomes = await incomeModel
    .find({ user: userid, date: { $gte: start, $lte: end } })
    .sort({ date: -1 });

  const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
  const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
  const numberOfTransactions = incomes.length;

  const recentTransactions = incomes.slice(0, 9);

  res.status(200).json({
    success: true,
    data: {
      totalIncome,
      averageIncome,
      numberOfTransactions,
      recentTransactions,
      range,
    },
  });
}
