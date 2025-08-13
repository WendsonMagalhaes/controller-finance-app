import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const categories = await prisma.categories.findMany()
            return res.status(200).json(categories)
        }
        if (req.method === 'POST') {
            const { name, type } = req.body
            if (!name || !type) {
                return res.status(400).json({ error: 'Name and type are required' })
            }
            const category = await prisma.categories.create({ data: { name, type } })
            return res.status(201).json(category)
        }
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    } catch {
        res.status(500).json({ error: 'Internal server error' })
    }
}
