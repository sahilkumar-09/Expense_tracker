import app from "./src/app.js"
import dotenv from "dotenv"
import connectToDb from "./src/config/db.js"

dotenv.config()
const port = process.env.PORT
connectToDb()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})