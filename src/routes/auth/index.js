import DevModel from "../dev/schema.js"
import EmployerModel from "../employer/schema.js"
import {
  JWTAuthenticate,
  verifyRefreshTokenAndGenerateNewTokens,
} from "../../auth/tools.js"
import { Router } from "express"
import createHttpError from "http-errors"

const authRouter = Router()

// Register as a Developer

authRouter.post("/developer-register", async (req, res, next) => {
    try {
        const dev = new DevModel(req.body)
        const { _id } = await dev.save()
        res.status(201).send({ _id })
    } catch (error) {
        res.status(500).send(error)
    }
})

// Register as an Employer

authRouter.post("/employer-register", async (req, res, next) => {
    try {
        const employer = new EmployerModel(req.body)
        const { _id } = await employer.save()
        res.status(201).send({ _id })
    } catch (error) {
        res.status(500).send(error)
    }
})

export default authRouter