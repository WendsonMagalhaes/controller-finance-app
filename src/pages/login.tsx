import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from '../styles/pages/login.module.css'
import { useUser } from '../contexts/UserContext'

interface LoginResponse {
    user: {
        id: number
        name: string
        email: string
    }
    token: string
}

export default function Login() {
    const router = useRouter()
    const { loginUser } = useUser()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await axios.post<LoginResponse>('/api/users/login', { email, password })
            loginUser(res.data.user)
            router.push('/')
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Erro ao fazer login')
            } else {
                setError('Erro inesperado ao fazer login')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Login</h2>
                {error && <p className={styles.error}>{error}</p>}
                <label className={styles.label}>
                    Email:
                    <input
                        className={styles.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                </label>
                <label className={styles.label}>
                    Senha:
                    <input
                        className={styles.input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    )
}
