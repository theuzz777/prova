import express from "express";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.json());

const times = [
  { id: 1, nome: "Corinthians ", série: "A" },
  { id: 2, nome: "Palmeiras", série: "A" },
  { id: 3, nome: "Flamengo ",série: "A" },
  { id: 4, nome: "Vasco", série: "A" },
  { id: 5, nome: "Botafogo", série: "A" },
  { id: 6, nome: "São Paulo", série: "A" },
  { id: 7, nome: "Grêmio", série: "A" },
  { id: 8, nome: "Santos", série: "A" }
];

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenSecreto = process.env.TOKEN_SECRETO;

  if (authHeader !== `Bearer ${tokenSecreto}`) {
    return res.status(401).json({
      erro: "Acesso não autorizado. Token ausente ou inválido"
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    disciplina: "Desenvolvimento de Websites",
    bimestre: "3º bimestre"
  });
});

app.get("/alunos", (req, res) => {
  res.json(alunos);
});

app.get("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);

  const aluno = alunos.find((aluno) => aluno.id === id);

  if (!aluno) {
    return res.status(404).json({
      message: "Aluno não encontrado"
    });
  }

  res.json(aluno);
});

app.post("/alunos", (req, res) => {
  const novoAluno = {
    id: alunos.length + 1,
    nome: req.body.nome,
    turma: req.body.turma
  };

  alunos.push(novoAluno);

  res.status(201).json({
    mensagem: "Aluno cadastrado com sucesso",
    aluno: novoAluno
  });
});

app.patch("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, turma } = req.body;

  const aluno = alunos.find((aluno) => aluno.id === id);

  if (!aluno) {
    return res.status(404).json({
      message: "Aluno não encontrado"
    });
  }

  if (nome) {
    aluno.nome = nome;
  }

  if (turma) {
    aluno.turma = turma;
  }

  res.json(aluno);
});

app.delete("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);

  const alunoIndex = alunos.findIndex((aluno) => aluno.id === id);

  if (alunoIndex === -1) {
    return res.status(404).json({
      message: "Aluno não encontrado"
    });
  }

  alunos.splice(alunoIndex, 1);

  res.json({
    message: "Aluno removido com sucesso"
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
