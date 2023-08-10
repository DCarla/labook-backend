export enum TipoDeUsuario {
  Admin = "Admin",
  User = "User",
}
export type UserDB = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: TipoDeUsuario;
  created_at: string;
};

export interface postsDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  updated_at: string;
}
