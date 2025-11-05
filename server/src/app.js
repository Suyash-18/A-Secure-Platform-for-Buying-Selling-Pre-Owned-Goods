import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// routes
import userRouter from './routes/user.route.js'
app.use("/api/v1/user", userRouter)

import productRoutes from "./routes/product.route.js"
app.use("/api/products", productRoutes)

import geocodeRoutes from "./routes/geocode.route.js"
app.use("/api/geocode", geocodeRoutes)


import paymentRouter from "./routes/payment.route.js";
app.use("/api/payment", paymentRouter);


app.get("/", (req, res) => {
    res.send("Server is running")
})

export { app }
