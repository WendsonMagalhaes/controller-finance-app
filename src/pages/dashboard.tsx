import React from 'react'
import styles from '../styles/pages/dashboard.module.css'

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <p>Resumo financeiro visual com gráficos e cards aqui.</p>
    </div>
  )
}
