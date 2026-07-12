import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    type: {
        type: String,
        default: "expense",
    },
}, { timestamps: true })

const expenseModel = mongoose.model("expense", expenseSchema)
export default expenseModel