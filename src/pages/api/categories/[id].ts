import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' })

    try {
        if (req.method === 'PUT') {
            const { name, type } = req.body
            const updated = await prisma.categories.update({
                where: { id: Number(id) },
                data: { name, type },
            })
            return res.status(200).json(updated)
        }

        if (req.method === 'DELETE') {
            await prisma.categories.delete({ where: { id: Number(id) } })
            return res.status(204).end()
        }

        if (req.method === 'GET') {
            const category = await prisma.categories.findUnique({ where: { id: Number(id) } })
            if (!category) return res.status(404).json({ error: 'Category not found' })
            return res.status(200).json(category)
        }

        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    } catch {
        res.status(500).json({ error: 'Internal server error' })
    }
}
