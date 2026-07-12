import express from "express"
import authRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import incomeRoutes from "./routes/incomeRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import dashboardRouter from "./routes/dashboardRoutes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes)
app.use("/api/dashboard", dashboardRouter)

export default app