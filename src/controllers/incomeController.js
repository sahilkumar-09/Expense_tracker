import incomeModel from "../models/incomeModel.js";

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
    userid: user,
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
  const income = await incomeModel.find({ userid });

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

  const { description, amount } = req.body;

  const updateIncome = await incomeModel.findOneAndUpdate(
    { _id, userid },
    { description, amount },
  );

  if (!updateIncome) {
    return res.status(404).json({
      success: false,
      message: "Income do not update",
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
