import prisma from "../../config/prisma.js";

export function listarTimes() {
   return prisma.times.findMany({ orderBy: { id: "asc" } });
}

export function buscarTimePorId(id) {
   return prisma.times.findUnique({ where: { id } });
}

export function criarTime({ nome, serie }) {
   return prisma.times.create({ data: { nome, serie } });
}

export function atualizarTime(id, dados) {
   return prisma.times.update({ where: { id }, data: dados });
}

export function excluirTime(id) {
   return prisma.times.delete({ where: { id } });
}