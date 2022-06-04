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
        const employer = await EmployerModel.findById(req.params.id)
        const { companyName, contactName, companyLogo, contactEmail, ...other } = employer._doc;
        if (employer) {
            res.status(200).send(other)
        } else {
            res.status(500).send(error.message)
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
            const savedRole = await role.save()
            await employer.updateOne({ $push: { rolesAvailable: role }, new: true })
            res.status(200).send(savedRole)
        } else {
            res.status(500).send(error)
        }
     
    } catch (error) {
        res.status(500).send(error)
    }
})

// Get Employer Roles

employerRouter.get("/:employerId/roles", async (req, res, next) => {
    try {
        const employer = await EmployerModel(req.body.employerId)
        let roles = employer.rolesAvailable
        if (employer) {
            res.status(200).json( roles )
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Edit Role

employerRouter.put("/:employerId/roles/:id", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const employer = await EmployerModel.findById(req.params.employerId)
        const role = await RoleModel.findById(req.params.id)

    } catch (error) {
        res.status(500).send(error)
    }
})


export default employerRouter