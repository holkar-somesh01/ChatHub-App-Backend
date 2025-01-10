const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { adminProtected } = require("./middleware/Protected")
require("dotenv").config()

const app = express()
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/contact", adminProtected, require("./routes/newUser.routes"))
app.use("/api/message", adminProtected, require("./routes/message.routes"))

app.use("*", (req, res) => {
    res.status(404).json({ status: 404, message: "RESOURCE NOT FOUND" })
})
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ status: 500, message: "SERVER ERROR", error: err.message })
})

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED")
    app.listen(process.env.PORT, console.log("SERVER RUNNING 🏃‍♂️"))
})