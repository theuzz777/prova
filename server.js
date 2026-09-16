import express from "express";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.json());

// =========================
// DADOS
// =========================

const times = [
  { id: 1, nome: "Corinthians", serie: "A" },
  { id: 2, nome: "Palmeiras", serie: "A" },
  { id: 3, nome: "Flamengo", serie: "A" },
  { id: 4, nome: "Vasco", serie: "A" },
  { id: 5, nome: "Botafogo", serie: "A" },
  { id: 6, nome: "São Paulo", serie: "A" },
  { id: 7, nome: "Grêmio", serie: "A" },
  { id: 8, nome: "Santos", serie: "A" }
];



// =========================
// AUTENTICAÇÃO
// =========================

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenSecreto = process.env.TOKEN_SECRETO;

  if (!tokenSecreto) {
    return res.status(500).json({
      erro: "TOKEN_SECRETO não configurado no arquivo .env"
    });
  }

  if (authHeader !== `Bearer ${tokenSecreto}`) {
    return res.status(401).json({
      erro: "Acesso não autorizado. Token ausente ou inválido"
    });
  }

  next();
}

// =========================
// ROTA PRINCIPAL
// =========================

app.get("/", (req, res) => {
  res.json({
    mensagem: "Servidor Express funcionando!",
    disciplina: "Desenvolvimento de Websites",
    bimestre: "3º bimestre"
  });
});

// =====================================================
// TIMES
// =====================================================

// GET - listar todos os times
app.get("/times", (req, res) => {
  res.json(times);
});

// GET - buscar um time pelo ID
app.get("/times/:id", (req, res) => {
  const id = Number(req.params.id);

  const time = times.find((time) => time.id === id);

  if (!time) {
    return res.status(404).json({
      mensagem: "Time não encontrado"
    });
  }

  res.json(time);
});

// POST - cadastrar um novo time
app.post("/times", (req, res) => {
  const { nome, serie } = req.body;

  if (!nome || !serie) {
    return res.status(400).json({
      erro: "Nome e série são obrigatórios"
    });
  }

  const novoTime = {
    id: times.length > 0 ? times[times.length - 1].id + 1 : 1,
    nome,
    serie
  };

  times.push(novoTime);

  res.status(201).json({
    mensagem: "Time cadastrado com sucesso",
    time: novoTime
  });
});

// PATCH - atualizar um time
app.patch("/times/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, serie } = req.body;

  const time = times.find((time) => time.id === id);

  if (!time) {
    return res.status(404).json({
      mensagem: "Time não encontrado"
    });
  }

  if (nome) {
    time.nome = nome;
  }

  if (serie) {
    time.serie = serie;
  }

  res.json({
    mensagem: "Time atualizado com sucesso",
    time
  });
});

// DELETE - excluir um time
app.delete("/times/:id", (req, res) => {
  const id = Number(req.params.id);

  const timeIndex = times.findIndex((time) => time.id === id);

  if (timeIndex === -1) {
    return res.status(404).json({
      mensagem: "Time não encontrado"
    });
  }

  times.splice(timeIndex, 1);

  res.json({
    mensagem: "Time removido com sucesso"
  });
});

// =====================================================
// ALUNOS
// =====================================================

// GET - listar todos os alunos
app.get("/alunos", (req, res) => {
  res.json(alunos);
});

// GET - buscar aluno pelo ID
app.get("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);

  const aluno = alunos.find((aluno) => aluno.id === id);

  if (!aluno) {
    return res.status(404).json({
      mensagem: "Aluno não encontrado"
    });
  }

  res.json(aluno);
});

// POST - cadastrar aluno
app.post("/alunos", (req, res) => {
  const { nome, turma } = req.body;

  if (!nome || !turma) {
    return res.status(400).json({
      erro: "Nome e turma são obrigatórios"
    });
  }

  const novoAluno = {
    id: alunos.length > 0 ? alunos[alunos.length - 1].id + 1 : 1,
    nome,
    turma
  };

  alunos.push(novoAluno);

  res.status(201).json({
    mensagem: "Aluno cadastrado com sucesso",
    aluno: novoAluno
  });
});

// PATCH - atualizar aluno
app.patch("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, turma } = req.body;

  const aluno = alunos.find((aluno) => aluno.id === id);

  if (!aluno) {
    return res.status(404).json({
      mensagem: "Aluno não encontrado"
    });
  }

  if (nome) {
    aluno.nome = nome;
  }

  if (turma) {
    aluno.turma = turma;
  }

  res.json({
    mensagem: "Aluno atualizado com sucesso",
    aluno
  });
});

// DELETE - excluir aluno
app.delete("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);

  const alunoIndex = alunos.findIndex((aluno) => aluno.id === id);

  if (alunoIndex === -1) {
    return res.status(404).json({
      mensagem: "Aluno não encontrado"
    });
  }

  alunos.splice(alunoIndex, 1);

  res.json({
    mensagem: "Aluno removido com sucesso"
  });
});

// =====================================================
// EXEMPLO DE ROTA PROTEGIDA
// =====================================================

app.get("/protegido", autenticar, (req, res) => {
  res.json({
    mensagem: "Você acessou uma rota protegida!"
  });
});

// =====================================================
// SERVIDOR
// =====================================================

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
