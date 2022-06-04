import { Router } from "express"
import DevModel from "./schema.js"
import RoleModel from "./schema.js"
import { JWTAuthMiddleware } from "../../auth/token.js"
import createHttpError from "http-errors"

const roleRouter = Router()

roleRouter.post("/role", async (req, res, next) => {
    try {
        const role = new RoleModel(req.body)
        let { _id } = await role.save()
        res.status(200).send(role)
    } catch (error) {
        res.status(500).send(error)
    }
})


export default roleRouter