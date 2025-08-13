import React from 'react'
import styles from '../styles/pages/details.module.css'

export default function Details() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Detalhes do Mês</h1>
            <p>Exibe lista detalhada de gastos e receitas para mobile.</p>
        </div>
    )
}
