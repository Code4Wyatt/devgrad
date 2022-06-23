import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import authRouter from "../src/routes/auth/index.js"
import devRouter from "../src/routes/dev/index.js"
import employerRouter from "../src/routes/employer/index.js"
import roleRouter from "../src/routes/roles/index.js"
import { unauthorizedHandler, forbiddenHandler, catchAllHandler } from "./errorHandlers.js"

const server = express()

const port = process.env.PORT || 5050

// Middlewares

server.use(cors())
server.use(express.json())

// Routes

server.use("/auth", authRouter)
server.use("/developer", devRouter)
server.use("/employer", employerRouter)
server.use("/roles", roleRouter)

// Error Handlers

server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

// Database Connection

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})

export default server