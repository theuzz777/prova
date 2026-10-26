import "dotenv/config";
import express from "express";
import prisma from "./config/prisma.js";
import {
  atualizar,
  buscarPorId,
  criar,
  excluir,
  listarTodos,
} from "./controllers/timescontroller.js";

const app = express();
const port = Number(process.env.PRISMA_API_PORT || 3001);

app.use(express.json());

function autenticar(req, res, next) {
  const tokenSecreto = process.env.TOKEN_SECRETO;
  const [tipo, token] = (req.headers.authorization || "").split(" ");

  if (!tokenSecreto) {
    return res.status(500).json({ erro: "TOKEN_SECRETO não configurado no .env" });
  }

  if (tipo !== "Bearer" || token !== tokenSecreto) {
    return res.status(401).json({ erro: "Token ausente ou inválido" });
  }

  next();
}

app.get("/times", listarTodos);
app.get("/times/:id", buscarPorId);
app.post("/times", autenticar, criar);
app.put("/times/:id", autenticar, atualizar);
app.delete("/times/:id", autenticar, excluir);

app.use((error, req, res, next) => {
  console.error("Erro na API MySQL:", error.message);
  res.status(500).json({ erro: "Erro ao acessar o MySQL" });
});

try {
  await prisma.$connect();
  app.listen(port, () => {
    console.log(`API Prisma conectada ao MySQL em http://localhost:${port}`);
    console.log("GET /times lista os registros; POST /times salva um registro no MySQL.");
  });
} catch (error) {
  console.error("Não foi possível conectar ao MySQL:", error.message);
  await prisma.$disconnect();
  process.exitCode = 1;
}
