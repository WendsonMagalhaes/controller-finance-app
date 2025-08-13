import React from 'react'
import styles from '../styles/components/FloatingButton.module.css'

interface FloatingButtonProps {
    onClick: () => void
    label?: string
}

export default function FloatingButton({ onClick, label = '+' }: FloatingButtonProps) {
    return (
        <button className={styles.floatingButton} onClick={onClick} aria-label="Adicionar transação">
            {label}
        </button>
    )
}
