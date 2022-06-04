import DevModel from "../dev/schema.js"
import {
  JWTAuthenticate,
  verifyRefreshTokenAndGenerateNewTokens,
} from "../../auth/tools.js"
import { Router } from "express"
import createHttpError from "http-errors"

const authRouter = Router()