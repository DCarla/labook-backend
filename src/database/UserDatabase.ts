import { UserDB } from "../types";
import { BaseDataBase } from "./BaseDatabase";

export class UserDatabase extends BaseDataBase {
  public static TABLE_USERS = "users";

  public async findUsers(q: string | undefined) {
    let usersDB;
    if (q) {
      const resultado: UserDB[] = await BaseDataBase.connection(
        UserDatabase.TABLE_USERS
      ).where("name", "LIKE", "%${q}%");

      usersDB = resultado;
    }
  }
}
