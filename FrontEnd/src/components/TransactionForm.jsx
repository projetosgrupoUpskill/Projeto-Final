import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api";
import { ThemeContext } from "../context/ThemeContext";
import styles from "./styles/TransactionForm.module.css";

const MAX_CHARS = 50;
const MAX_AMOUNT = 1000000;

const todayISO = () => new Date().toISOString().split("T")[0];

export default function TransactionForm({
    initialValues = {},
    onSubmit,
    onCancel,
    submitLabel = "Adicionar",
    isPending = false,
}) {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    const defaults = {
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: todayISO(),
        ...initialValues,
    };

    const [description, setDescription] = useState(defaults.description);
    const [amount, setAmount] = useState(defaults.amount);
    const [type, setType] = useState(defaults.type);
    const [category, setCategory] = useState(defaults.category);
    const [date, setDate] = useState(defaults.date);
    const [errors, setErrors] = useState({});

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const validateDescription = (value) => {
        if (!value || value.trim() === "") return "A descrição é obrigatória.";
        if (value.trim().length < 3)
            return "A descrição deve ter pelo menos 3 caracteres.";
        return null;
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        if (value.length > MAX_CHARS) return;
        setDescription(value);
        setErrors((prev) => ({ ...prev, description: validateDescription(value) }));
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/\.\d{3,}$/.test(value)) return;
        if (parseFloat(value) > MAX_AMOUNT) return;
        setAmount(value);
        setErrors((prev) => ({
            ...prev,
            amount: !value || parseFloat(value) <= 0 ? "Valor é obrigatório." : null,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed = description.trim();
        const descError = validateDescription(trimmed);
        const amountError =
            !amount || parseFloat(amount) <= 0 ? "Valor é obrigatório." : null;
        const categoryError =
            !category || category === "" ? "Categoria é obrigatória." : null;

        if (descError || amountError || categoryError) {
            setErrors({
                description: descError,
                amount: amountError,
                category: categoryError,
            });
            return;
        }

        onSubmit({
            description: trimmed,
            amount: parseFloat(amount),
            category: category,
            date: new Date(
                `${date}T${new Date().toTimeString().slice(0, 8)}`,
            ).toISOString(),
            type: type,
        });
        setDescription("");
        setAmount("");
        setCategory("");
        setDate(todayISO());
        setType("expense");
        setErrors({});
    };

    const charsLeft = MAX_CHARS - description.length;
    const atLimit = charsLeft === 0;

    const isDirty =
        description !== defaults.description ||
        amount !== defaults.amount ||
        type !== defaults.type ||
        String(category) !== String(defaults.category) || //o select devolve uma string, enquanto o que vem da BD é um numero, para a comparação dar correta é necessario normalizar os dois lados
        date !== defaults.date;

    const isSubmitDisabled = isPending || Boolean(onCancel) && !isDirty;

    return (
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
                    {atLimit ? (
                        <span className={styles.errorMsg}></span>
                    ) : errors.description ? (
                        <span className={styles.errorMsg}>{errors.description}</span>
                    ) : (
                        <span />
                    )}
                    <span className={atLimit ? styles.charsWarning : styles.charsCount}>
                        {charsLeft}/{MAX_CHARS}
                    </span>
                </div>
            </div>

            <div className={styles.rowFields}>
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
                        {errors.amount ? (
                            <span className={styles.errorMsg}>{errors.amount}</span>
                        ) : (
                            <span />
                        )}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Data</label>
                    <input
                        type="date"
                        value={date}
                        max={todayISO()}
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
            </div>

            <div className={styles.categoryTypeRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Categoria</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setErrors((prev) => ({ ...prev, category: null }));
                        }}
                        className={styles.input}
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.label || cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <span className={styles.errorMsg}>{errors.category}</span>
                    )}
                </div>

                <div className={`${styles.formGroup} ${styles.typeFieldCentered}`}>
                    <label className={styles.label}>Tipo</label>
                    <div className={`${styles.radioGroup} ${styles.radioGroupCentered}`}>
                        <label className={styles.radioItem}>
                            <input
                                type="radio"
                                name="transaction-type"
                                value="income"
                                checked={type === "income"}
                                onChange={(e) => setType(e.target.value)}
                            />
                            <span className={styles.radioLabel}>Receita</span>
                        </label>
                        <label className={styles.radioItem}>
                            <input
                                type="radio"
                                name="transaction-type"
                                value="expense"
                                checked={type === "expense"}
                                onChange={(e) => setType(e.target.value)}
                            />
                            <span className={styles.radioLabel}>Despesa</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className={onCancel ? styles.formActions : undefined}>
                {onCancel && (
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className={`${styles.submitButton} ${isDark ? styles.submitButtonDark : ""}`}
                    disabled={isSubmitDisabled}
                >
                    {isPending ? "A guardar..." : submitLabel}
                </button>
            </div>
        </form>
    );
}