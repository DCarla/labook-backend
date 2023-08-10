import express from "express";
import { UserBusiness } from "../Business/UserBusiness";
import { Usercontroller } from "../controller/UserController";
import { UserDatabase } from "../database/UserDatabase";
import { HashManager } from "../services/hashManager";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager } from "../services/tokenManager";

export const userRouter = express.Router();

const userController = new Usercontroller(
  new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
  )
);

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.getUsers);
