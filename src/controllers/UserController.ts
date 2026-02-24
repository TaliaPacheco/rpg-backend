import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/authConfig';

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

            const existingUser = await prisma.user.findUnique({
                where: { email },
            })

            if (existingUser) {
                res.status(409).json({ message: 'Email já está em uso' })
                return
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                }
            })
            res.status(201).json({ message: 'Usuario criado', Usuario: user})
            
        }catch(error){
            res.status(500).json({ message: 'Erro ao criar usuario'})
        }
    }

    async loginUser(req: Request, res: Response){
        try{
            const { email, password } = req.body

            if (!email || !password){
                res.status(400).json({ message: 'Email e senha são obrigatórios!'})
                return
            }

            const user = await prisma.user.findUnique({
                where: { email },
            })

            if (!user){
                res.status(404).json({ message: 'Usuario não encontrado'})
                return
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid){
                res.status(401).json({ message: 'Senha incorreta'})
                return
            }

            const token = generateToken(user.id)

            res.json({ message: 'Login realizado com sucesso', 
                token, 
                user: { id: user.id, name: user.name, email: user.email }
            })
        }catch(error){
            res.status(500).json({ message: 'Erro ao realizar login'})
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

    async deleteUser(req: Request, res: Response){
        try {
            const { id } = req.params

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Usuario não encontrado' })
                return
            }

            await prisma.user.delete({
                where: { id },
            })

            res.json({ message: 'Usuario deletado com sucesso' })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar usuario' })
        }
    }

    async updateUser(req: Request, res: Response){
        try {
            const { id } = req.params
            const { name, email, password } = req.body

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Usuario não encontrado' })
                return
            }

            const updatedData: any = {}

            if (name) updatedData.name = name
            if (email) updatedData.email = email
            if (password) updatedData.password = await bcrypt.hash(password, 10)

            const updatedUser = await prisma.user.update({
                where: { id },
                data: updatedData,
            })

            res.json({ message: 'Usuario atualizado com sucesso', Usuario: updatedUser })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar usuario' })
        }
    }
}
