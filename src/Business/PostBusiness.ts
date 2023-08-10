import { NOTFOUND } from "dns";
import { PostDatabase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/post/createPost.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import {
  LikeOrDislikePostInputDTO,
  LikeOrDislikePostOutputDTO,
} from "../dtos/post/likeordislikePost.dto";
import { ForbiddenError } from "../Errors/forbiddenError";
import { NotFoundError } from "../Errors/notFoundError";
import { UnauthorizedError } from "../Errors/unauthorizedError";
import { LikeDislikeDB, Posts, PostDB, POST_LIKE } from "../models/Posts";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager } from "../services/tokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManeger: TokenManager
  ) {}

  public getPost = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManeger.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    const postsWithCreatorName =
      await this.postDatabase.findPostsWithCreatorName();

    console.log(postsWithCreatorName);

    const posts = postsWithCreatorName.map((postWithCreatorName) => {
      const post = new Posts(
        postWithCreatorName.id,
        postWithCreatorName.creator_id,
        postWithCreatorName.content,
        postWithCreatorName.likes,
        postWithCreatorName.dislikes,
        postWithCreatorName.created_at,
        postWithCreatorName.updated_at,
        postWithCreatorName.creator_name
      );

      return post.toBusinessModel();
    });

    const output: GetPostsOutputDTO = posts;

    return output;
  };

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { token, content } = input;

    const pAutenticado = this.tokenManeger.getPayload(token);
    if (!pAutenticado) {
      throw new UnauthorizedError("Não autorizado");
    }
    const id = this.idGenerator.generate();
    const postDb = new Posts(
      id,
      pAutenticado.id,
      content,
      0,
      0,
      new Date().toString(),
      new Date().toString(),
      pAutenticado.name
    );
    await this.postDatabase.createPost(postDb.toDBModel());

    return undefined;
  };

  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const { token, idToEdit, content } = input;
    const pAutenticado = this.tokenManeger.getPayload(token);

    if (!pAutenticado) {
      throw new UnauthorizedError(" Necessário estar autenticado");
    }

    const postDb = await this.postDatabase.findPostById(idToEdit);
    if (!postDb) {
      throw new NotFoundError(" Post não existe");
    }

    if (postDb.creator_id != pAutenticado.id) {
      throw new UnauthorizedError("Apenas o criador pode editar o post");
    }
    const newPost = new Posts(
      idToEdit,
      pAutenticado.id,
      content,
      postDb.likes,
      postDb.dislikes,
      postDb.created_at,
      new Date().toISOString(),
      pAutenticado.name
    );
    await this.postDatabase.editPost(newPost.toDBModel());

    return undefined;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { idToDelete, token } = input;
    const pAutenticado = this.tokenManeger.getPayload(token);
    if (!pAutenticado)
      throw new UnauthorizedError("Você precisa estar autenticado");
    const postDb = await this.postDatabase.findPostById(idToDelete);
    if (!postDb) throw new NotFoundError(" Post não existe");
    if (
      postDb.creator_id != pAutenticado.id &&
      pAutenticado.role == USER_ROLES.NORMAL
    )
      throw new UnauthorizedError("Apenas admin ou criador podem apagar posts");

    await this.postDatabase.removePost(idToDelete);
    return undefined;
  };

  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    const { token, idToLikeOrDislike, like } = input;

    const payload = this.tokenManeger.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    const postDBWithCreatorName =
      await this.postDatabase.findPostsWithCreatorNameById(idToLikeOrDislike);

    if (!postDBWithCreatorName) {
      throw new NotFoundError("Post id not found");
    }

    const post = new Posts(
      postDBWithCreatorName.id,
      postDBWithCreatorName.creator_id,
      postDBWithCreatorName.content,
      postDBWithCreatorName.likes,
      postDBWithCreatorName.dislikes,
      postDBWithCreatorName.created_at,
      postDBWithCreatorName.updated_at,
      postDBWithCreatorName.creator_name
    );

    const likeSQLlite = like ? 1 : 0;

    const likeOrDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      post_id: postDBWithCreatorName.id,
      like: likeSQLlite,
    };

    const likeOrDislikePostExists = await this.postDatabase.findLikeDislikePost(
      likeOrDislikeDB
    );

    if (post.getCreatorId() === payload.id) {
      throw new ForbiddenError(
        "The post creator can not give likes or dislikes"
      );
    }

    if (likeOrDislikePostExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB);
        post.removeLike();
      } else {
        await this.postDatabase.updateLikeOrDislike(likeOrDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeOrDislikePostExists === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB);
        post.removeDislike();
      } else {
        await this.postDatabase.updateLikeOrDislike(likeOrDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postDatabase.insertLikeOrDislike(likeOrDislikeDB);
      like ? post.addLike() : post.addDislike();
    }

    const updatedPostDB = post.toDBModel();
    await this.postDatabase.editPost(updatedPostDB);

    const output: LikeOrDislikePostOutputDTO = undefined;

    return output;
  };
}
