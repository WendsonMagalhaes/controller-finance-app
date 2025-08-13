import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/pages/register.module.css'

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError('Por favor, preencha todos os campos.')
            return
        }

        if (form.password !== form.confirmPassword) {
            setError('As senhas não coincidem.')
            return
        }

        try {
            setLoading(true)
            await axios.post('/api/users', {
                name: form.name,
                email: form.email,
                password: form.password,
            })
            setSuccess('Usuário criado com sucesso! Você já pode fazer login.')
            setForm({ name: '', email: '', password: '', confirmPassword: '' })
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar usuário. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Cadastro</h2>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}

                <label className={styles.label}>
                    Nome:
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={loading}
                        required
                    />
                </label>

                <label className={styles.label}>
                    E-mail:
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={loading}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Senha:
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={loading}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Confirmar Senha:
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={styles.input}
                        disabled={loading}
                        required
                    />
                </label>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>
        </div>
    )
}
