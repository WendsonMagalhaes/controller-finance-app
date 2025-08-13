import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/../lib/prisma'
import bcrypt from 'bcryptjs'

interface UpdateUserData {
    name?: string
    email?: string
    password_hash?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid id' })
    }

    try {
        if (req.method === 'PUT') {
            const { name, email, password } = req.body

            const data: UpdateUserData = {}
            if (name) data.name = name
            if (email) data.email = email
            if (password) {
                data.password_hash = await bcrypt.hash(password, 10)
            }

            const updated = await prisma.users.update({
                where: { id: Number(id) },
                data,
            })

            return res.status(200).json({
                id: updated.id,
                name: updated.name,
                email: updated.email,
            })
        }

        if (req.method === 'DELETE') {
            await prisma.users.delete({ where: { id: Number(id) } })
            return res.status(204).end()
        }

        if (req.method === 'GET') {
            const user = await prisma.users.findUnique({ where: { id: Number(id) } })
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }
            return res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
            })
        }

        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}
