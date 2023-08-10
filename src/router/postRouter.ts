import express from "express";
import { PostBusiness } from "../Business/PostBusiness";
import { PostsController } from "../controller/PostController";
import { PostDatabase } from "../database/PostDatabase";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager } from "../services/tokenManager";

export const postRouter = express.Router();

const postController = new PostsController(
  new PostBusiness(new PostDatabase(), new IdGenerator(), new TokenManager())
);

postRouter.get("/", postController.getPosts);
postRouter.post("/", postController.createPost);
postRouter.put("/:id", postController.editPost);
postRouter.delete("/:id", postController.deletePosts);
postRouter.put("/:id/like", postController.likeOrDislikePost);
