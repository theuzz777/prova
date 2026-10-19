import express from "express";
import "dotenv/config";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "time de futebol",
      version: "1.0.0",
      description: "nome e serie dos times de futebol"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "DESCRIÇÃO DO SERVIDOR"
      }
    ],
    components: {
      schemas: {
        Time: {
          type: "object",
          required: ["nome", "serie"],
          properties: {
            nome: {
              type: "string",
              example: "Corinthians"
            },
            serie: {
              type: "string",
              example: "A"
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "1234"
        }
      }
    }
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
const app = express();
const port = 3000;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

  const [tipo, tokenRecebido] = (authHeader || "").split(" ");

  if (tipo !== "Bearer" || tokenRecebido !== tokenSecreto) {
    return res.status(401).json({
      erro: "Acesso não autorizado. Token ausente ou inválido"
    });
  }

  next();
}

// =========================
// ROTA PRINCIPAL
// =========================



// =====================================================
// TIMES
// =====================================================

/**
 * @openapi
 * /times:
 *   get:
 *     tags:
 *       - times
 *     summary: Lista todos os times
 *     description: Retorna todos os times cadastrados.
 *     responses:
 *       200:
 *         description: Lista de times retornada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               - nome: Corinthians
 *                 serie: A
 *               - nome: Palmeiras
 *                 serie: A
 */
app.get("/times", (req, res) => {
  res.json(times);
});

/**
 * @openapi
 * /times/{id}:
 *   get:
 *     tags:
 *       - times
 *     summary: Busca um time pelo ID
 *     description: Retorna um time usando o seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do time.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Time encontrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               nome: Corinthians
 *               serie: A
 *       404:
 *         description: Time não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Time não encontrado
 */
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

/**
 * @openapi
 * /times:
 *   post:
 *     tags:
 *       - times
 *     summary: Cadastra um novo time
 *     description: Cria um time com nome e série. Esta rota exige token Bearer.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nome: Santos
 *             serie: A
 *     responses:
 *       201:
 *         description: Time cadastrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Time cadastrado com sucesso
 *               time:
 *                 nome: Santos
 *                 serie: A
 *       400:
 *         description: Nome ou série não informado.
 *         content:
 *           application/json:
 *             example:
 *               erro: Nome e série são obrigatórios
 *       401:
 *         description: Token ausente ou inválido.
 *         content:
 *           application/json:
 *             example:
 *               erro: Acesso não autorizado. Token ausente ou inválido
 */
app.post("/times", autenticar, (req, res) => {
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

/**
 * @openapi
 * /times/{id}:
 *   patch:
 *     tags:
 *       - times
 *     summary: Atualiza parcialmente um time
 *     description: Atualiza o nome e/ou a série de um time. Esta rota exige token Bearer.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do time.
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             serie: B
 *     responses:
 *       200:
 *         description: Time atualizado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Time atualizado com sucesso
 *               time:
 *                 nome: Corinthians
 *                 serie: B
 *       400:
 *         description: Nenhum campo válido informado.
 *         content:
 *           application/json:
 *             example:
 *               erro: Informe nome ou série
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Time não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Time não encontrado
 */
app.patch("/times/:id", autenticar, (req, res) => {
  const id = Number(req.params.id);
  const { nome, serie } = req.body;

  const time = times.find((time) => time.id === id);

  if (!time) {
    return res.status(404).json({
      mensagem: "Time não encontrado"
    });
  }

  if (!nome && !serie) {
    return res.status(400).json({
      erro: "Informe nome ou série"
    });
  }

  if (nome) time.nome = nome;
  if (serie) time.serie = serie;

  res.json({
    mensagem: "Time atualizado com sucesso",
    time
  });
});

/**
 * @openapi
 * /times/{id}:
 *   delete:
 *     tags:
 *       - times
 *     summary: Exclui um time
 *     description: Remove um time pelo ID. Esta rota exige token Bearer.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do time.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Time removido com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Time removido com sucesso
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Time não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Time não encontrado
 */
app.delete("/times/:id", autenticar, (req, res) => {
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


// =====================================================
// ROTA PROTEGIDA
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