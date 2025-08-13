import React, { useState } from 'react'
import styles from '../styles/components/TransactionFormModal.module.css'
import { useUser } from '../contexts/UserContext'

interface Category {
    id: number
    name: string
    type: string
}

interface TransactionFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: FormState) => void
    categories: Category[]
}

interface FormState {
    categoryId: number
    description: string
    type: 'receita' | 'despesa'
    subtype: 'fixa' | 'variavel' | 'eventual' | 'parcelada'
    amount: number
    date: string
    totalInstallments: number
}

export default function TransactionFormModal({
    isOpen,
    onClose,
    onSave,
    categories,
}: TransactionFormModalProps) {
    const { user } = useUser()

    const [form, setForm] = useState<FormState>({
        categoryId: 0,
        description: '',
        type: 'receita',
        subtype: 'fixa',
        amount: 0,
        date: '',
        totalInstallments: 1,
    })

    const [loading, setLoading] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]:
                name === 'amount' || name === 'totalInstallments' || name === 'categoryId'
                    ? Number(value)
                    : value,
        }))
    }

    function resetForm() {
        setForm({
            categoryId: 0,
            description: '',
            type: 'receita',
            subtype: 'fixa',
            amount: 0,
            date: '',
            totalInstallments: 1,
        })
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!user) {
            alert('Usuário não encontrado. Faça login novamente.')
            return
        }

        if (form.categoryId === 0 || form.amount <= 0 || !form.date) {
            alert('Por favor, preencha todos os campos obrigatórios.')
            return
        }

        setLoading(true)
        try {
            await onSave(form)
            resetForm()
            onClose()
        } catch {
            alert('Falha ao salvar transação')
        } finally {
            setLoading(false)
        }
    }


    if (!isOpen) return null

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Adicionar Transação</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>
                        Tipo:
                        <select name="type" value={form.type} onChange={handleChange}>
                            <option value="receita">Receita</option>
                            <option value="despesa">Despesa</option>
                        </select>
                    </label>
                    <label>
                        Subtipo:
                        <select name="subtype" value={form.subtype} onChange={handleChange}>
                            <option value="fixa">Fixa</option>
                            <option value="variavel">Variável</option>
                            <option value="eventual">Eventual</option>
                            <option value="parcelada">Parcelada</option>
                        </select>
                    </label>
                    <label>
                        Categoria:
                        <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                            <option value={0}>Selecione</option>
                            {categories
                                .filter(cat => cat.type === form.type) // só mostra categorias do tipo selecionado
                                .map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                        </select>
                    </label>

                    <label className={styles.fullWidth}>
                        Descrição:
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Descrição opcional"
                        />
                    </label>
                    <label>
                        Valor:
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            min={0}
                            step={0.01}
                            required
                        />
                    </label>
                    <label>
                        Data:
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    {form.subtype === 'parcelada' && (
                        <label>
                            Parcelas:
                            <input
                                type="number"
                                name="totalInstallments"
                                value={form.totalInstallments}
                                min={1}
                                onChange={handleChange}
                            />
                        </label>
                    )}
                    <div className={styles.buttons}>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button type="button" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
