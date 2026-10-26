import {
  atualizarTime,
  buscarTimePorId,
  criarTime,
  excluirTime,
  listarTimes,
} from "../src/models/time.models.js";

export async function listarTodos(req, res, next) {
  try {
    const times = await listarTimes();
    return res.status(200).json(times);
  } catch (error) {
    return next(error);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const time = await buscarTimePorId(id);
    if (!time) {
      return res.status(404).json({ erro: "Time não encontrado" });
    }

    return res.status(200).json(time);
  } catch (error) {
    return next(error);
  }
}

export async function criar(req, res, next) {
  try {
    const { nome, serie } = req.body;
    if (typeof nome !== "string" || !nome.trim() || typeof serie !== "string" || !serie.trim()) {
      return res.status(400).json({ erro: "Informe nome e série do time" });
    }

    const time = await criarTime({ nome: nome.trim(), serie: serie.trim() });
    return res.status(201).json({ mensagem: "Time salvo no MySQL", time });
  } catch (error) {
    return next(error);
  }
}

export async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const dados = {};
    for (const campo of ["nome", "serie"]) {
      if (req.body[campo] !== undefined) {
        if (typeof req.body[campo] !== "string" || !req.body[campo].trim()) {
          return res.status(400).json({ erro: `O campo ${campo} deve ser um texto não vazio` });
        }
        dados[campo] = req.body[campo].trim();
      }
    }

    if (Object.keys(dados).length === 0) {
      return res.status(400).json({ erro: "Informe nome ou série para atualizar" });
    }

    const timeExistente = await buscarTimePorId(id);
    if (!timeExistente) {
      return res.status(404).json({ erro: "Time não encontrado" });
    }

    const time = await atualizarTime(id, dados);
    return res.status(200).json({ mensagem: "Time atualizado", time });
  } catch (error) {
    return next(error);
  }
}

export async function excluir(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    const time = await buscarTimePorId(id);
    if (!time) {
      return res.status(404).json({ erro: "Time não encontrado" });
    }

    await excluirTime(id);
    return res.status(200).json({ mensagem: "Time excluído", time });
  } catch (error) {
    return next(error);
  }
}
