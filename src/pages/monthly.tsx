import React from 'react'
import styles from '../styles/pages/monthly.module.css'

export default function Monthly() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Resumo Mensal</h1>
            <p>Resumo numérico com receitas, despesas e saldo.</p>
            {/* Aqui você pode implementar o filtro por mês e lista de receitas/despesas */}
        </div>
    )
}
