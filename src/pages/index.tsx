import React, { useState, useEffect } from 'react'
import styles from '../styles/pages/index.module.css'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import TransactionCard from '../components/TransactionCard'
import FloatingButton from '../components/FloatingButton'
import TransactionFormModal from '../components/TransactionFormModal'
import { useUser } from '../contexts/UserContext'
import axios from 'axios'

type TransactionData = {
    id: number
    description?: string
    amount: number
    date: string
    type: 'receita' | 'despesa'
    categoryName: string
}

type TransactionFormData = {
    categoryId: number
    description?: string
    type: string
    subtype: string
    amount: number
    date: string
    totalInstallments?: number
}

type Category = {
    id: number
    name: string
    type: string
}

function monthYearKey(dateString: string) {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
}

export default function HomePage() {
    const [transactions, setTransactions] = useState<TransactionData[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isModalOpen, setModalOpen] = useState(false)
    const getCurrentMonthYearKey = () => {
        const now = new Date()
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
    }
    const [selectedMonth, setSelectedMonth] = useState<string | null>(getCurrentMonthYearKey())
    const { user } = useUser()

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await axios.get('/api/categories')
                setCategories(res.data)
            } catch (error) {
                console.error('Erro ao carregar categorias:', error)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        async function fetchTransactions() {
            if (!user) return
            try {
                const response = await axios.get('/api/transactions', {
                    params: { userId: user.id },
                })
                const data: TransactionData[] = response.data.map((tx: any) => ({
                    id: tx.id,
                    description: tx.description,
                    amount: Number(tx.amount),
                    date: tx.date,
                    type: tx.type,
                    categoryName: tx.categories?.name ?? 'Sem categoria',
                }))
                setTransactions(data)
            } catch (error) {
                console.error('Erro ao buscar transações:', error)
            }
        }
        fetchTransactions()
    }, [user])

    const handleSave = async (data: TransactionFormData) => {
        if (!user) {
            console.error('Usuário não encontrado.')
            return
        }
        try {
            const payload = { ...data, userId: user.id }
            const response = await axios.post('/api/transactions', payload)
            if (Array.isArray(response.data)) {
                setTransactions((old) => [
                    ...old,
                    ...response.data.map((tx: any) => ({
                        id: tx.id,
                        description: tx.description,
                        amount: Number(tx.amount),
                        date: tx.date,
                        type: tx.type,
                        categoryName: tx.categories?.name ?? 'Sem categoria',
                    })),
                ])
            } else {
                const tx = response.data
                setTransactions((old) => [
                    ...old,
                    {
                        id: tx.id,
                        description: tx.description,
                        amount: Number(tx.amount),
                        date: tx.date,
                        type: tx.type,
                        categoryName: tx.categories?.name ?? 'Sem categoria',
                    },
                ])
            }
        } catch (error) {
            console.error('Erro ao salvar transação:', error)
            throw error
        }
    }

    const months = Array.from(
        new Set(transactions.map((tx) => monthYearKey(tx.date)))
    ).sort((a, b) => (a > b ? 1 : -1))

    const filteredTransactions = selectedMonth
        ? transactions.filter((tx) => monthYearKey(tx.date) === selectedMonth)
        : transactions

    return (
        <div className={styles.home}>
            <Header />
            <Sidebar />

            <div className={styles.monthsScroll}>
                {months.map((month) => (
                    <button
                        key={month}
                        className={`${styles.monthButton} ${selectedMonth === month ? styles.activeMonth : ''
                            }`}
                        onClick={() => setSelectedMonth(month)}
                    >
                        {new Date(month + '-01').toLocaleDateString('pt-BR', {
                            month: 'short',
                            year: 'numeric',
                        })}
                    </button>
                ))}
                <button
                    className={`${styles.monthButton} ${selectedMonth === null ? styles.activeMonth : ''
                        }`}
                    onClick={() => setSelectedMonth(null)}
                >
                    Ver tudo
                </button>
            </div>

            <main className={styles.main}>
                <h2 className={styles.heading}>Resumo Financeiro</h2>

                {filteredTransactions.length === 0 && (
                    <p>Nenhuma transação para esse período.</p>
                )}

                {filteredTransactions.map((tx) => (
                    <TransactionCard
                        key={tx.id}
                        description={tx.description}
                        amount={tx.amount}
                        date={tx.date}
                        type={tx.type}
                        categoryName={tx.categoryName}
                    />
                ))}

                <FloatingButton onClick={() => setModalOpen(true)} />

                <TransactionFormModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                    categories={categories}
                />
            </main>
        </div>
    )
}
