import { Router } from "express"
import DevModel from "./schema.js"
import RoleModel from "../roles/schema.js"
import EmployerModel from "./schema.js"
import { JWTAuthMiddleware } from "../../auth/token.js"
import createHttpError from "http-errors"

const employerRouter = Router()

// Get Employer

employerRouter.get("/:id", async (req, res) => {
    try {
        const employer = await EmployerModel(req.body.employerId)
        if (employer) {
            res.status(200).send({ employer })
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

// Add Role

employerRouter.put("/:employerId/roles", JWTAuthMiddleware, async (req, res, next) => {
   
    try {
        const employer = await EmployerModel.findById(req.params.employerId)
        
        if (!employer.rolesAvailable.includes(req.body.jobTitle)) {
            let role = new RoleModel(req.body)
            await employer.updateOne({ $push: { rolesAvailable: role }, new: true })
            res.status(200).send(employer)
        } else {
            res.status(500).send(error)
        }
     
    } catch (error) {
        res.status(500).send(error)
    }
})

// Edit Role




export default employerRouter