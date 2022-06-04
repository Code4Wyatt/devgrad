import { Router } from "express"
import DevModel from "./schema.js"
import { JWTAuthMiddleware } from "../../auth/token.js"
import createHttpError from "http-errors"

const devRouter = Router()