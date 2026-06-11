import { useState } from "react"
import styles from "../components/styles/AddTransaction.module.css"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransaction, getCategories } from "../api";
import Card from "../components/Card";

const MAX_CHARS = 50;
const MAX_AMOUNT = 1000000;

export default function AddTransaction({ onAdd }) {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState("expense")
    const [category, setCategory] = useState("outro")
    const [errors, setErrors] = useState({});
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
          setErrors({});

        },
        onError: () => {
            alert('Erro ao adicionar transação. Tente novamente.');
        }
      });

      const validateDescription = (value) => {
        if(!value || value.trim() === "") return "A descrição é obrigatória.";
        if (value.trim().length < 3) return "A descrição deve ter pelo menos 3 caracteres.";
        return null;
        }

        const handleDescriptionChange = (e) => {
            const value = e.target.value;
            if (value.length > MAX_CHARS) return;
            setDescription(value);
            
            const error = validateDescription(value);
            setErrors((prev) => ({ ...prev, description: error }));
        }

        const handleAmountChange = (e) => {
            const value = e.target.value;

            if (/\.\d{3,}$/.test(value)) return; // ← só bloqueia 3+ casas decimais 
            if (parseFloat(value) > MAX_AMOUNT) return; // bloqueia valor excessivo
            setAmount(value);

            const error = !value || parseFloat(value) <= 0 ? "Valor é obrigatório." : null;
            setErrors((prev) => ({ ...prev, amount: error }));
        }


    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed = description.trim();
        const descError = validateDescription(trimmed);
        const amountError = !amount || parseFloat(amount) <= 0 ? "Valor é obrigatório." : null;

        if (descError || amountError) {
            setErrors({
                description: descError,
                amount: amountError
            });
                return
        };
    
        const numericValue = parseFloat(amount);
        
        const finalAmount = type === "expense" ? -Math.abs(numericValue) : Math.abs(numericValue);
    
        mutation.mutate({
          description,
          amount: finalAmount,
          date: new Date().toISOString(),
          category: category || "outro"
        });
      };

      const charsLeft = MAX_CHARS - description.length;
      const atLimit = charsLeft === 0;

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
                            onChange={handleDescriptionChange}
                            className={`${styles.input} ${errors.description || atLimit ? styles.inputError : ""}`}
                        />
                        <div className={styles.inputMeta}>
                        {atLimit
                                    ? <span className={styles.errorMsg}></span>
                                    : errors.description
                                        ? <span className={styles.errorMsg}>{errors.description}</span>
                                        : <span />
                                }
                                <span className={atLimit ? styles.charsWarning : styles.charsCount}>
                                    {charsLeft}/{MAX_CHARS}
                                </span>
                            </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Valor (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={handleAmountChange}
                            className={`${styles.input} ${errors.amount ? styles.inputError : ""}`}
                            required
                        />
                        <div className={styles.inputMeta}>
                            {errors.amount
                                ? <span className={styles.errorMsg}>{errors.amount}</span>
                                : <span />
                            }
                        </div>
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