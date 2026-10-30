import prisma from "../config/db.js";

export function cadastrarUsuario({ nome, email, senhaHash }) {
  return prisma.usuarios.create({ 
    data:{
        nome,
        email,
        senhaHash
        

    },
    select:{
        id:true,
        nome:true,
        email:true,
        senhaHash:true,
    }
}   

export function buscarPorEmail({email }) {
    return prisma.usuarios.findUnique({
        where: {
            email
            
        }
}