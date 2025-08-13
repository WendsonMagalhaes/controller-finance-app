import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' })

    try {
        if (req.method === 'GET') {
            const transaction = await prisma.transactions.findUnique({ where: { id: Number(id) } })
            if (!transaction) return res.status(404).json({ error: 'Transaction not found' })
            return res.status(200).json(transaction)
        }
        if (req.method === 'PUT') {
            const {
                user_id: userId,
                category_id: categoryId,
                description,
                type,
                subtype,
                amount,
                date,
                total_installments: totalInstallments,
                installment_number: installmentNumber,
                parent_installment_id: parentInstallmentId,
            } = req.body

            const updated = await prisma.transactions.update({
                where: { id: Number(id) },
                data: {
                    user_id: userId,
                    category_id: categoryId,
                    description,
                    type,
                    subtype,
                    amount,
                    date: date ? new Date(date) : undefined,
                    total_installments: totalInstallments,
                    installment_number: installmentNumber,
                    parent_installment_id: parentInstallmentId,
                },
            })
            return res.status(200).json(updated)
        }
        if (req.method === 'DELETE') {
            await prisma.transactions.delete({ where: { id: Number(id) } })
            return res.status(204).end()
        }
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
