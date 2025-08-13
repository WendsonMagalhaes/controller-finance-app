import React, { useState } from 'react'
import styles from '../styles/components/Sidebar.module.css'
import Link from 'next/link'
import { FaTachometerAlt, FaCalendarAlt, FaListAlt, FaBars, FaTimes } from 'react-icons/fa'

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true)

    const menuItems = [
        { href: '/', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { href: '/monthly', label: 'Resumo Mensal', icon: <FaCalendarAlt /> },
        { href: '/details', label: 'Detalhes do Mês', icon: <FaListAlt /> },
    ]

    return (
        <nav className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <button
                className={styles.toggleButton}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            <ul className={styles.ul}>
                {menuItems.map(({ href, label, icon }) => (
                    <li key={href} title={!isOpen ? label : undefined}>
                        <Link href={href} className={styles.link}>
                            <span className={styles.icon}>{icon}</span>
                            {isOpen && <span className={styles.label}>{label}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
