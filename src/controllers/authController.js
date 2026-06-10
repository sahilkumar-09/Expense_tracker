import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function userRegisterController(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(401).json({
            success: false,
            message: "Please enter your details"
        })
    }

    const isUserExistAlready = await userModel.findOne({email})

    if (isUserExistAlready) {
        return res.status(404).json({
            success: false,
            message: "User already exist"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email, 
        password: hashedPassword
    })

    const createUser = await userModel.findById(user._id).select("-password")

    if (!createUser) {
        return res.status(404).json({
            success: false,
            message: "User do not created"
        })
    }

    const token = jwt.sign({userid: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

    res.cookie("token", token)

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        createUser
    })

}
