import { Router } from "express"
import { JWTAuthMiddleware } from "../../auth/token.js"
import createHttpError from "http-errors"
import RoleModel from "./schema.js"

const roleRouter = Router()

roleRouter.get("/", async (req, res) => {
    try {
        const roles = await RoleModel.find({});
        if (roles) {
            res.status(200).json({ roles });
        }
        console.log(roles);
    } catch (error) {
        res.status(500).send(error.message);
    }
})



export default roleRouter