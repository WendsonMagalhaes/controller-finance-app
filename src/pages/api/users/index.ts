import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const users = await prisma.users.findMany()
            return res.status(200).json(users)
        }

        if (req.method === 'POST') {
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email and password required' })
            }

            const passwordHash = await bcrypt.hash(password, 10)
            const user = await prisma.users.create({
                data: { name, email, password_hash: passwordHash },
            })

            return res.status(201).json({ id: user.id, name: user.name, email: user.email })
        }

        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    } catch {
        res.status(500).json({ error: 'Internal server error' })
    }
}
