import { Router } from "express"
import DevModel from "./schema.js"
import RoleModel from "../roles/schema.js"
import EmployerModel from "./schema.js"
import { JWTAuthMiddleware } from "../../auth/token.js"
import createHttpError from "http-errors"

const employerRouter = Router()

export default employerRouter