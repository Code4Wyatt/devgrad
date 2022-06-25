import { Router } from "express"
import DevModel from "./schema.js"
import RoleModel from "../roles/schema.js"
import EmployerModel from "./schema.js"
import { JWTAuthMiddleware } from "../../auth/token.js"
import createHttpError from "http-errors"

const employerRouter = Router()

// Get Employers

employerRouter.get("/all", async (req, res) => {
    try {
        const employers = await EmployerModel.find({})
        if (employers) {
            res.status(200).send({ employers });
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

// Get Employer

employerRouter.get("/:id", async (req, res) => {
    try {
        const employer = await EmployerModel.findById(req.params.id)
        const { companyName, companyDescription, contactName, companyLogo, contactEmail, rolesAvailable, techStack, amountOfEmployees, headquartersLocation } = employer._doc;
        if (employer) {
            res.status(200).send({ companyName,companyDescription, contactName, companyLogo, contactEmail, rolesAvailable, techStack, amountOfEmployees, headquartersLocation })
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
        const employer = await EmployerModel.findById(req.params.employerId)
        let roles = employer.rolesAvailable
        if (employer) {
            res.status(200).json( roles )
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Get Role

employerRouter.get("/roles/:id", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const role = await RoleModel.findOne({ id: req.params.id })
        res.status(200).send({ role })
    } catch (error) {
        res.status(500).send(error)
    }
})

// Edit Role

employerRouter.put("/roles/:id", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const roleId = req.params.id;
    const updatedRole = await RoleModel.findByIdAndUpdate(roleId, req.body, {
      new: true,
    }); // by default findByIdAndUpdate returns the document pre-update, if I want to retrieve the updated document, I should use new:true as an option
    if (updatedRole) {
      res.send(updatedRole);
    } else {
      next(createHttpError(404, `User with id ${roleId} not found!`));
    }
    } catch (error) {
        res.status(500).send(error)
    }
})

// Delete Role

employerRouter.delete("/roles/:id", JWTAuthMiddleware, async (req, res) => {
    try {
      await RoleModel.findByIdAndDelete(req.params.id);
      res.status(200).json("Role has been deleted successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
 
});


export default employerRouter