import mongoose from "mongoose"

const blackListTokenSchema = new mongoose.Schema({
    token: {    
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date
    }
})

const blackListTokens = mongoose.model("blackToken", blackListTokenSchema)

export default blackListTokens