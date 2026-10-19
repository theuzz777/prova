import "dotenv/config";
import express from "express";
import prisma from "./config/prisma.js";

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

app.get("/times", async (req, res) => {
  const times = await prisma.times.findMany({ orderBy: { id: "asc" } });
  res.json(times);
});

app.get("/times/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  const time = await prisma.times.findUnique({ where: { id } });
  if (!time) {
    return res.status(404).json({ erro: "Time não encontrado" });
  }

  res.json(time);
});

app.post("/times", autenticar, async (req, res) => {
  const { nome, serie } = req.body;

  if (typeof nome !== "string" || !nome.trim() || typeof serie !== "string" || !serie.trim()) {
    return res.status(400).json({ erro: "Informe nome e série do time" });
  }

  const time = await prisma.times.create({
    data: { nome: nome.trim(), serie: serie.trim() },
  });

  res.status(201).json({ mensagem: "Time salvo no MySQL", time });
});

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
