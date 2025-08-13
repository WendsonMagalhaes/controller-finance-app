import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    try {
        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' })
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET!,
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}
