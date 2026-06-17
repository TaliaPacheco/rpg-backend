import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { prisma } from '../lib/prisma';
import { authMiddleware } from './middleware/authMiddleware';

import userRoutes from './routes/UserRoute';
import campaignRoutes from './routes/CampaignRoute';
import characterRoutes from './routes/CharacterRoute';
import journalEntryRoutes from './routes/JournalEntryRoute';
import questRoutes from './routes/QuestRoutes';
import sseRoutes from './routes/sseRoute';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/users', userRoutes);

app.use('/campaigns', sseRoutes);

app.use(authMiddleware)

app.use('/campaigns', campaignRoutes);
app.use('/characters', characterRoutes);
app.use('/journal-entries', journalEntryRoutes);
app.use('/quests', questRoutes);

app.get('/', async (req: Request, res: Response)  => {
    const users = await prisma.user.findMany()
    res.json({message: 'Funcionando, papai!', users})
})

app.listen(port, () => {
    console.log(`Servidor esta rodando aqui: http://localhost:${port}`);
})

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
})