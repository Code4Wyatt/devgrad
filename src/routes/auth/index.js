import DevModel from "../dev/schema.js"
import EmployerModel from "../employer/schema.js"
import {
  JWTAuthenticate,
  verifyRefreshTokenAndGenerateNewTokens,
} from "../../auth/tools.js"
import { Router } from "express"
import createHttpError from "http-errors"

const authRouter = Router()

// Register as a Developer

authRouter.post("/developer-register", async (req, res, next) => {
    try {
        const dev = new DevModel(req.body)
        const { _id } = await dev.save()
        res.status(201).send({ _id })
    } catch (error) {
        res.status(500).send(error)
    }
})

// Register as an Employer

authRouter.post("/employer-register", async (req, res, next) => {
    try {
        const employer = new EmployerModel(req.body)
        const { _id } = await employer.save()
        res.status(201).send({ _id })
    } catch (error) {
        res.status(500).send(error)
    }
})

// Developer Login

authRouter.post("/developer-login", async (req, res, next) => {
  try {
    // 1. Obtain credentials from req.body
    const { email, password } = req.body;
    
    // 2. Verify credentials
    const dev = await DevModel.checkCredentials(email, password);

    if (email === ' ') {
      next(createHttpError(400, "Email blank!"));
    }
    if (dev) {
      // 3. If credentials are fine we are going to generate an access token and send it as a response
      const { accessToken, refreshToken } = await JWTAuthenticate(dev);
      
      res.send({ email, accessToken, refreshToken });
    } else {
      // 4. If they are not --> error (401)
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

// Employer Login

authRouter.post("/employer-login", async (req, res, next) => {
  try {
    // 1. Obtain credentials from req.body
    const { email, password } = req.body;

    // 2. Verify credentials
    const employer = await EmployerModel.checkCredentials(email, password);

    if (employer) {
      // 3. If credentials are fine we are going to generate an access token and send it as a response
      const { accessToken, refreshToken } = await JWTAuthenticate(employer);
      
      res.send({ email, accessToken, refreshToken });
    } else {
      // 4. If they are not --> error (401)
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

// Refresh Token

authRouter.post("/refreshToken", async (req, res, next) => {
  try {
    // 1. Receive the current refresh token in req.body
    const { currentRefreshToken } = req.body;

    // 2. Check the validity of that token (check if token is not expired, check if it hasn't been compromised, check if it is in user's record in db)
    const { accessToken, refreshToken } =
      await verifyRefreshTokenAndGenerateNewTokens(currentRefreshToken);

    // 3. If everything is fine --> generate a new pair of tokens (accessToken2 and refreshToken2)
    // 4. Send tokens back as a response
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});


export default authRouter