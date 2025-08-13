import React, { useState, useRef, useEffect } from 'react'
import styles from '../styles/components/Header.module.css'
import { FaUserCircle } from 'react-icons/fa'
import { useUser } from '../contexts/UserContext' // ajuste caminho conforme seu projeto

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const { user } = useUser()

    // Fecha menu se clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [menuOpen])

    return (
        <header className={styles.header}>
            <div className={styles.left}>Controle Financeiro</div>
            <div className={styles.center}>Dashboard</div>
            <div className={styles.right} ref={menuRef}>
                <FaUserCircle
                    size={28}
                    className={styles.userIcon}
                    onClick={() => setMenuOpen((open) => !open)}
                    tabIndex={0}
                    role="button"
                    aria-label="User menu"
                    onKeyDown={(e) => e.key === 'Enter' && setMenuOpen((open) => !open)}
                />
                {/* Aqui exibe o nome do usuário logado */}
                {user && <div className={styles.userName}>{user.name}</div>}

                {menuOpen && (
                    <div className={styles.menu}>
                        <button className={styles.menuItem}>Configurações</button>
                        <button className={styles.menuItem}>Logout</button>
                    </div>
                )}
            </div>
        </header>
    )
}
