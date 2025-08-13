import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, month, year } = req.query

    if (!userId || !month || !year) {
        return res.status(400).json({ error: 'userId, month and year are required' })
    }

    const userIdNum = Number(userId)
    const monthNum = Number(month)
    const yearNum = Number(year)

    if (isNaN(userIdNum) || isNaN(monthNum) || isNaN(yearNum)) {
        return res.status(400).json({ error: 'userId, month and year must be numbers' })
    }

    const startDate = new Date(yearNum, monthNum - 1, 1)
    const endDate = new Date(yearNum, monthNum, 1)

    try {
        const receitas = await prisma.transactions.aggregate({
            where: {
                user_id: userIdNum,
                type: 'receita',
                date: { gte: startDate, lt: endDate },
            },
            _sum: { amount: true },
        })

        const despesas = await prisma.transactions.aggregate({
            where: {
                user_id: userIdNum,
                type: 'despesa',
                date: { gte: startDate, lt: endDate },
            },
            _sum: { amount: true },
        })

        const receitasAmount = Number(receitas._sum?.amount ?? 0)
        const despesasAmount = Number(despesas._sum?.amount ?? 0)

        const saldo = receitasAmount - despesasAmount

        return res.status(200).json({
            receitas: receitasAmount,
            despesas: despesasAmount,
            saldo,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
