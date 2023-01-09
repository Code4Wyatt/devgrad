import { Router } from "express";
import DevModel from "./schema.js";
import EmployerModel from "../employer/schema.js";
import { JWTAuthMiddleware } from "../../auth/token.js";
import createHttpError from "http-errors";

const devRouter = Router();

// Get User On Log In

devRouter.get(
  "/currentUser/:email",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const email = req.params.email;
      let currentUser = await DevModel.findOne({ email: email });

      res.status(200).send({ currentUser });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

devRouter.get("/currentUser", JWTAuthMiddleware, async (req, res, next) => {
  try {
    let localUsername =
      typeof window !== "undefined" ? localStorage.getItem("auth.email") : null;
    let currentUser = await DevModel.findOne({ email: localUsername });
    res.status(200).send({ currentUser });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get All Developers

devRouter.get("/all", async (req, res, next) => {
  try {
    const developers = await DevModel.find({});
    res.status(200).send({ developers });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Developer Search

devRouter.get("/search", async (req, res, next) => {
  const location = req.query.location;
  const languages = req.query.languages;
  const experienceLevel = req.query.experienceLevel;

  const query = {};

  if (location) {
    query.location = { $regex: req.query.location, $options: 'i' };
  }

  if (languages) {
    query.languages = req.query.languages;
  }

  if (experienceLevel) {
    query.experienceLevel =  req.query.experienceLevel;
  }

  try {
    const developers = await DevModel.find(query);
    res.status(200).send({ developers });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get Specific Developer

devRouter.get("/:id", async (req, res, next) => {
  try {
    const developer = await DevModel.findById(req.params.id);
    const { firstName, email, ...other } = developer._doc;
    res.status(200).send(developer);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Edit Developer

devRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedDev = await DevModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    // by default findByIdAndUpdate returns the document pre-update, if I want to retrieve the updated document, I should use new:true as an option
    if (updatedDev) {
      res.send(updatedDev);
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// Add Project to Developer

devRouter.post('/:id/addproject', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await DevModel.findById(req.params.id);
    // Add the new project to the user's list of projects
    user.projects.push(req.body);
    // Save the updated user to the database
    await user.save();
    // Send a response indicating that the project was added successfully
    res.send({ message: 'Project added successfully' });
  } catch (error) {
     next(createHttpError(404, `User with id ${userId} not found!`));
  }
})

// Delete Developer As Admin

devRouter.delete("/remove/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await DevModel.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

// Delete Developer As Developer

devRouter.delete("/delete/:id", JWTAuthMiddleware, async (req, res) => {
  try {
    await DevModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Account has been deleted successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Follow Employer

devRouter.put("/:id/follow", async (req, res, next) => {
  if (req.body.companyId !== req.params.id) {
    try {
      const dev = await DevModel.findById(req.params.id);
      const company = await EmployerModel.findById(req.body.companyId);
      if (!dev.companiesFollowing.includes(req.body.companyId)) {
        await dev.updateOne({
          $push: { companiesFollowing: req.body.companyId },
        });
        await company.updateOne({ $push: { devsFollowing: req.params.id } });
        res
          .status(200)
          .send("Employer has been followed the employer successfully");
      } else {
        res.status(403).json("You are already following this employer");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

// Unfollow User

devRouter.put("/:id/unfollow", async (req, res) => {
  if (req.body.companyId !== req.params.id) {
    try {
      const dev = await DevModel.findById(req.params.id);
      const company = await EmployerModel.findById(req.body.companyId);
      if (dev.companiesFollowing.includes(req.body.companyId)) {
        await dev.updateOne({
          $pull: { companiesFollowing: req.body.companyId },
        });
        await company.updateOne({ $pull: { devsFollowing: req.params.id } });
        res.status(200).json("Employer has been unfollowed");
      } else {
        res.status(403).json("You are not following this employer");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not following yourself");
  }
});

export default devRouter;
