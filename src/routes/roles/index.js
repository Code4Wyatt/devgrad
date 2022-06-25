import { Router } from "express"
import { JWTAuthMiddleware } from "../../auth/token.js"
import createHttpError from "http-errors"
import RoleModel from "./schema.js"

const roleRouter = Router()

// Get all roles

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

// Get specific role by ID

roleRouter.get("/:id", async (req, res) => {
    try {
        const role = await RoleModel.findById(req.params.id);
        if (role) {
            res.status(200).json({ role });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// Get specific role by company

roleRouter.get("/search/:company", async (req, res) => {
    try {
        const roles = await RoleModel.find({"company": `${req.params.company}`});
        if (roles) {
            res.status(200).json({ roles });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
})



export default roleRouter