import { Request, Response } from "express";
import { UserDatabase } from "../database/UserDatabase";
export class UserController {
  public getUsers = async (req: Request, res: Response) => {
    try {
      const q = req.query.q as string | undefined;
      const userDatabase = new UserDatabase();
      const usersDB = await userDatabase.findUsers(q);
    } catch (error: any) {
      console.log(error);
    }
    if (req.statusCode === 200) {
      res.status(500);
    }
  };
}
