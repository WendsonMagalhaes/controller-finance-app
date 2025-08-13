import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/../lib/prisma'
import { Prisma } from '@prisma/client'
import type { transactions as TransactionModel } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const { userId, month, year } = req.query

            const filters: Prisma.transactionsWhereInput = {}
            if (userId) filters.user_id = Number(userId)
            if (month && year) {
                const start = new Date(Number(year), Number(month) - 1, 1)
                const end = new Date(Number(year), Number(month), 1)
                filters.date = { gte: start, lt: end }
            }

            const transactions = await prisma.transactions.findMany({
                where: filters,
                orderBy: { date: 'desc' },
                include: {
                    categories: true,
                },
            })

            return res.status(200).json(transactions)
        }

        if (req.method === 'POST') {
            const {
                userId,
                categoryId,
                description,
                type,
                subtype,
                amount,
                date,
                totalInstallments = 1,
            } = req.body

            const userIdNum = Number(userId)
            const categoryIdNum = Number(categoryId)

            if (
                isNaN(userIdNum) || userIdNum <= 0 ||
                isNaN(categoryIdNum) || categoryIdNum <= 0 ||
                !type ||
                !subtype ||
                !amount ||
                !date
            ) {
                return res.status(400).json({ error: 'Campos obrigatórios inválidos ou faltando' })
            }

            const numericAmount = typeof amount === 'string' ? Number(amount) : amount
            if (isNaN(numericAmount)) {
                return res.status(400).json({ error: 'Valor inválido para amount' })
            }

            const installments = Number(totalInstallments)
            if (isNaN(installments) || installments < 1) {
                return res.status(400).json({ error: 'Número de parcelas inválido' })
            }

            if (subtype === 'parcelada' && installments > 1) {
                const transactions: TransactionModel[] = []
                let parentId: number | null = null

                const parcelAmount = new Prisma.Decimal((numericAmount / installments).toFixed(2))

                for (let i = 1; i <= installments; i++) {
                    const installmentDate = new Date(date)
                    installmentDate.setMonth(installmentDate.getMonth() + i - 1)

                    const tx: TransactionModel = await prisma.transactions.create({
                        data: {
                            user_id: userIdNum,
                            category_id: categoryIdNum,
                            description,
                            type,
                            subtype,
                            amount: parcelAmount,
                            date: installmentDate,
                            total_installments: installments,
                            installment_number: i,
                            parent_installment_id: i === 1 ? null : parentId,
                        },
                        include: {
                            categories: true,
                        },
                    })

                    if (i === 1) parentId = tx.id
                    transactions.push(tx)
                }

                return res.status(201).json(transactions)
            } else {
                const decimalAmount = new Prisma.Decimal(numericAmount)

                const transaction = await prisma.transactions.create({
                    data: {
                        user_id: userIdNum,
                        category_id: categoryIdNum,
                        description,
                        type,
                        subtype,
                        amount: decimalAmount,
                        date: new Date(date),
                        total_installments: installments,
                        installment_number: 1,
                        parent_installment_id: null,
                    },
                    include: {
                        categories: true,
                    },
                })

                return res.status(201).json(transaction)
            }
        }

        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    } catch (error) {
        console.error('Erro no handler /api/transactions:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
