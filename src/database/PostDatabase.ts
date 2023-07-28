import { postsDB } from "../types";
import { BaseDataBase } from "./BaseDatabase";

export class PostDatabase extends BaseDataBase {
  public static POSTS_TABLE = "posts";
  public async getPost() {
    const resultado: Array<postsDB> = await BaseDataBase.connection(
      PostDatabase.POSTS_TABLE
    );
    return resultado;
  }
  public async createPost(newPost: postsDB) {
    await BaseDataBase.connection(PostDatabase.POSTS_TABLE);
    .insert(newPost)
  }
}
