import { useState } from "react"
import styles from "../components/styles/AddTransaction.module.css"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransaction, getCategories } from "../api";
import Card from "../components/Card";

export default function AddTransaction({ onAdd }) {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState("expense")
    const [category, setCategory] = useState("outro")
    const queryClient = useQueryClient();

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        });

    const mutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
        // Atualiza a lista no Dashboard automaticamente
          queryClient.invalidateQueries({queryKey:['transactions']});
          setDescription("");
          setAmount("");
          setCategory("outro");

        },
        onError: () => {
            alert('Erro ao adicionar transação. Tente novamente.');
        }
      });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount) return;
    
        const numericValue = parseFloat(amount);
        
        const finalAmount = type === "expense" ? -Math.abs(numericValue) : Math.abs(numericValue);
    
        mutation.mutate({
          description,
          amount: finalAmount,
          date: new Date().toISOString(),
          category: category || "outro"
        });
      };

    return (
        <div className={styles.card}>
            <Card title="Adicionar Transacção">

            <div className={styles.cardBody}>
                <form onSubmit={handleSubmit} className={styles.form}>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Descrição</label>
                        <input
                            type="text"
                            placeholder="Ex: Salário, Renda, Supermercado..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Valor (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Categoria</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.input} 
                        >
                            {categories.map(cat => (
                                <option key={cat.slug || cat.id} value={cat.slug || cat.id}>
                                    {cat.label || cat.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tipo</label>

                        <div className={styles.radioGroup}>
                            <label className={styles.radioItem}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={type === "income"}
                                    onChange={(e) => setType(e.target.value)}
                                    required
                                />
                                <span className={styles.radioLabel}>Receita</span>
                            </label>

                            <label className={styles.radioItem}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={type === "expense"}
                                    onChange={(e) => setType(e.target.value)}
                                    required
                                />
                                <span className={styles.radioLabel}>Despesa</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Adicionar
                    </button>
                </form>
                </div>
            </Card>
        </div>
    )
}