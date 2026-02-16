import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export class UserController {
    async listUsers(req: Request, res: Response) {
        try{
            const users = await prisma.user.findMany();
            res.json({message:'Lista dos usuarios processada com sucesso!', Usuarios: users})
        } catch(error){
            res.status(500).json({ message:'Não foi possivel retornar a tabela'})
        }
    }

    async createUser(req: Request, res: Response){
        try{
            const { name, email, password } = req.body

            if (!name || !email || !password) {
                res.status(400).json({ message: 'Nome, Email e senha são obrigatórios!'})
                return
            }

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password
                }
            })
            res.status(201).json({ message: 'Usuario criado', Usuario: user})
            
        }catch(error){
            res.status(500).json({ message: 'Erro ao criar usuario'})
        }
    }

    async getUserById(req: Request, res: Response){
        try{
            const { id } = req.params

            if (!id || typeof id !== 'string'){
                res.status(404).json({ message: 'Usuario não encontrado'})
                return
            }

            const user = await prisma.user.findUnique({
                where: { id },
            })

            

            res.json({ message: 'Usuario encontrado', Usuario: user})
        }catch(error){
            res.status(500).json({message: 'não foi possivel encontrar usuario'})
        }
    }
}