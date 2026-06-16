import express from "express"
import authRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import incomeRoutes from "./routes/incomeRoutes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/income", incomeRoutes);

export default app