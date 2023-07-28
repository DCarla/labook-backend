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
