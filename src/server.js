import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import listEndpoints from "express-list-endpoints"
import { unauthorizedHandler, forbiddenHandler, catchAllHandler } from "./errorHandlers.js"
import authRouter from "../src/routes/auth/index.js"
import devRouter from "../src/routes/dev/index.js"
import employerRouter from "../src/routes/employer/index.js"
import rolesRouter from "../src/routes/roles/index.js"
import "dotenv/config"

const server = express()

const port = process.env.PORT || 5050

// Middlewares
server.use(cors())
server.use(express.json())

// Routes
server.use("/auth", authRouter)
server.use("/developer", devRouter)
server.use("/employer", employerRouter)
server.use("/roles", rolesRouter)

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