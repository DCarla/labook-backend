import { Request, Response } from "express";
import { ZodError } from "zod";
import { PostBusiness } from "../Business/PostBusiness";
import { CreatePostSchema } from "../dtos/post/createPost.dto";
import { DeletePostSchema } from "../dtos/post/deletePost.dto";
import { EditPostSchema } from "../dtos/post/editPost.dto";
import { GetPostsSchema } from "../dtos/post/getPosts.dto";
import { LikeOrDislikePostSchema } from "../dtos/post/likeordislikePost.dto";
import { BaseError } from "../Errors/baseError";

export class PostsController {
  constructor(private postBusiness: PostBusiness) {}

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input = GetPostsSchema.parse({
        token: req.headers.authorization,
      });
      const output = await this.postBusiness.getPost(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Unexpected Error");
      }
    }
  };

  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostSchema.parse({
        token: req.headers.authorization,
        content: req.body.content,
      });

      const output = await this.postBusiness.createPost(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Unexpected Error");
      }
    }
  };

  public editPost = async (req: Request, res: Response) => {
    try {
      const input = EditPostSchema.parse({
        idToEdit: req.params.id,
        content: req.body.content,
        token: req.headers.authorization,
      });
      await this.postBusiness.editPost(input);
      res.status(200).send("Editado com sucesso");
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Unexpected Error");
      }
    }
  };

  public deletePosts = async (req: Request, res: Response) => {
    try {
      const input = DeletePostSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });

      await this.postBusiness.deletePost(input);

      res.status(200).send("Post deletado com sucesso");
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Unexpected Error");
      }
    }
  };

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikePostSchema.parse({
        token: req.headers.authorization,
        idToLikeOrDislike: req.params.id,
        like: req.body.like,
      });

      const output = await this.postBusiness.likeOrDislikePost(input);
      console.log(output);
      res
        .status(200)
        .send({ message: "Likes e dislikes efetuado com sucesso" });
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Unexpected error");
      }
    }
  };
}
