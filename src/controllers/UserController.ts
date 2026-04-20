import type { Request, Response } from '../types/express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/authConfig';
import { deleteUploadedFile, getFilenameFromPath } from '../middleware/uploadMiddleware';

export class UserController {
    async createUser(req: Request, res: Response){
        try{
            const { name, email, password } = req.body

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

            await prisma.campaign.create({
                data: {
                    title: `A Aventura de ${name}`,
                    description: 'Bem-vindo ao BitDragon! Esta é sua primeira campanha. Clique em editar para personalizá-la.',
                    userId: user.id,
                }
            })

            res.status(201).json({ message: 'Usuario criado', Usuario: user})
            
        }catch(error){
            console.error('Erro ao criar usuario:', error)
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
                res.status(400).json({ message: 'UserId inválido'})
                return
            }

            const user = await prisma.user.findUnique({
                where: { id },
                omit: { password: true },
            })

            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado'})
                return
            }

            res.json(user)
        }catch(error){
            res.status(500).json({message: 'Erro ao buscar usuário'})
        }
    }

    async deleteUser(req: Request, res: Response){
        try {
            const { id } = req.params

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Usuario não encontrado' })
                return
            }

            if (req.userId !== id) {
                res.status(403).json({ message: 'Você só pode deletar a própria conta' })
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

            if (req.userId !== id) {
                res.status(403).json({ message: 'Você só pode editar a própria conta' })
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

            res.status(200).json({ message: 'Usuario atualizado com sucesso', Usuario: updatedUser })
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar usuario' })
        }
    }

    async uploadProfileImage(req: Request, res: Response) {
        try {
            const { id } = req.params

            if (!id || typeof id !== 'string') {
                res.status(404).json({ message: 'Usuario não encontrado' })
                return
            }

            if (req.userId !== id) {
                if (req.file) {
                    deleteUploadedFile(getFilenameFromPath(req.file.path))
                }
                res.status(403).json({ message: 'Você só pode alterar a própria imagem de perfil' })
                return
            }

            if (!req.file) {
                res.status(400).json({ message: 'Nenhum arquivo foi enviado' })
                return
            }

            const user = await prisma.user.findUnique({
                where: { id },
            })

            if (!user) {
                res.status(404).json({ message: 'Usuario não encontrado' })
                return
            }

            if (user.profileImage) {
                deleteUploadedFile(user.profileImage)
            }

            const filename = getFilenameFromPath(req.file.path)

            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    profileImage: filename
                }
            })

            res.status(200).json({ 
                message: 'Imagem de perfil atualizada com sucesso', 
                Usuario: updatedUser,
                imageUrl: `/uploads/${filename}`
            })
        } catch (error) {
            if (req.file) {
                deleteUploadedFile(getFilenameFromPath(req.file.path))
            }
            res.status(500).json({ message: 'Erro ao fazer upload da imagem' })
        }
    }
}
