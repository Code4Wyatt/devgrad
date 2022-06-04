import { Router } from "express"
import DevModel from "./schema.js"
import RoleModel from "../roles/schema.js"
import { JWTAuthMiddleware } from "../../auth/token.js"
import createHttpError from "http-errors"

const employerRouter = Router()

employerRouter.post("/role", async (req, res, next) => {
    try {
        const role = await new RoleModel(req.body)
        let { _id } = await role.save()
        res.status(200).send({ _id })
    } catch (error) {
        res.status(500).send(error)
    }
})


export default employerRouter