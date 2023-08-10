import { UserDB } from "../models/User";
import { BaseDataBase } from "./BaseDatabase";

export class UserDatabase extends BaseDataBase {
  public static TABLE_USERS = "users";

  public async postUser(newUser: UserDB): Promise<void> {
    await BaseDataBase.connection(UserDatabase.TABLE_USERS).insert(newUser);
  }

  public async findUserByEmail(email: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseDataBase.connection(
      UserDatabase.TABLE_USERS
    ).where({ email });
    return userDB;
  }

  public async findUsers(q: string | undefined) {
    let usersDB;

    if (q) {
      const result: UserDB[] = await BaseDataBase.connection(
        UserDatabase.TABLE_USERS
      ).where("name", "LIKE", `%${q}%`);

      usersDB = result;
    } else {
      const result: UserDB[] = await BaseDataBase.connection(
        UserDatabase.TABLE_USERS
      );

      usersDB = result;
    }

    return usersDB;
  }

  public async findUserById(id: string) {
    const [userDB]: UserDB[] | undefined[] = await BaseDataBase.connection(
      UserDatabase.TABLE_USERS
    ).where({ id });

    return userDB;
  }

  public async insertUser(newUserDB: UserDB) {
    await BaseDataBase.connection(UserDatabase.TABLE_USERS).insert(newUserDB);
  }
}
