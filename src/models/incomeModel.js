import mongoose, { Mongoose } from "mongoose"

const incomeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    default: {
        type: String,
        default: "income"
    }
}, {timestamps: true})

const incomeModel = mongoose.Model("income", incomeSchema)
export default incomeModel