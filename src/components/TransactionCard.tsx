import React from 'react'
import styles from '../styles/components/TransactionCard.module.css'

interface TransactionCardProps {
    description?: string
    amount: number
    date: string
    type: 'receita' | 'despesa'
    categoryName: string
    installmentInfo?: string
}

export default function TransactionCard({
    description,
    amount,
    date,
    type,
    categoryName,
    installmentInfo,
}: TransactionCardProps) {
    return (
        <div className={`${styles.card} ${type === 'receita' ? styles.income : styles.expense}`}>
            <div className={styles.header}>
                <span className={styles.category}>{categoryName}</span>
                <span className={styles.date}>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className={styles.body}>
                <p className={styles.description}>{description || '-'}</p>
                <p className={styles.amount}>
                    {type === 'despesa' ? '-' : '+'} R$ {amount.toFixed(2)}
                </p>
            </div>
            {installmentInfo && <div className={styles.installment}>{installmentInfo}</div>}
        </div>
    )
}
