import {
  LikeDislikeDB,
  PostDB,
  PostDBWithCreatorName,
  POST_LIKE,
} from "../models/Posts";
import { BaseDataBase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDataBase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES = "likes_dislikes";

  public findPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const result: PostDB[] = await BaseDataBase.connection(
      PostDatabase.TABLE_POSTS
    )
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );
    return result as PostDBWithCreatorName[];
  };

  public createPost = async (newPost: PostDB): Promise<void> => {
    await BaseDataBase.connection(PostDatabase.TABLE_POSTS).insert(newPost);
  };

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [postDB]: PostDB[] | undefined[] = await BaseDataBase.connection(
      PostDatabase.TABLE_POSTS
    ).where({ id });

    return postDB;
  };

  public editPost = async (newPost: PostDB): Promise<void> => {
    await BaseDataBase.connection(PostDatabase.TABLE_POSTS)
      .update(newPost)
      .where({ id: newPost.id });
  };

  public removePost = async (id: string): Promise<void> => {
    await BaseDataBase.connection(PostDatabase.TABLE_POSTS).del().where({ id });
  };

  public findPostsWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const [result] = await BaseDataBase.connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({
        [`${PostDatabase.TABLE_POSTS}.id`]: id,
      });
    return result as PostDBWithCreatorName | undefined;
  };

  async findLikeDislike(userId: string, postId: string) {
    return await BaseDataBase.connection("like_deslike")
      .where({
        user_id: userId,
        post_id: postId,
      })
      .first();
  }

  async insertLikeDislike(userId: string, postId: string, like: number) {
    await this.deleteLikeDislike(userId, postId);

    await BaseDataBase.connection("like_deslike").insert({
      user_id: userId,
      post_id: postId,
      like: like,
    });
  }
  async updateLikeDislike(userId: string, postId: string, like: number) {
    await BaseDataBase.connection("like_deslike")
      .where({
        user_id: userId,
        post_id: postId,
      })
      .update({ like: like });
  }

  async deleteLikeDislike(userId: string, postId: string) {
    await BaseDataBase.connection("like_deslike")
      .where({
        user_id: userId,
        post_id: postId,
      })
      .del();
  }
}
