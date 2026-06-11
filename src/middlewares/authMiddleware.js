import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
import blackListTokens from "../models/blacklistTokenModel.js";

export async function authMiddleware(req, res, next) {

    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized please login"
        })
    }

    const blackListed = await blackListTokens.findOne({token})

    if(blackListed){
        return res.status(401).json({
            success: false,
            message: "Token has been blacklisted"
        })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await userModel.findById(decodedToken.userid);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
    
    req.user = user

    next()
}