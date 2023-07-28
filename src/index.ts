import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.listen(3003, () => {
  console.log("Servidor executado na porta 3003");
});
app.get("/ping", (req: Request, res: Response) => {
  res.send("Funcionando ");
});
