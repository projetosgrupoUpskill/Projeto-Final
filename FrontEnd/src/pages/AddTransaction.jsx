import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../api";
import Card from "../components/Card";
import TransactionForm from "../components/TransactionForm";
import styles from "../components/styles/AddTransaction.module.css";

export default function AddTransaction() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
        onError: () => {
            alert("Erro ao adicionar transação. Tente novamente.");
        },
    });

    const handleSubmit = ({ description, amount, category, date, type }) => {
        mutation.mutate({
            title: description,
            amount: Math.abs(Number(amount)),
            type: type,
            transaction_date: new Date(date).toISOString().slice(0, 19).replace("T", " "),
            category_id: category,
            currency_id: 1,
        });
    };

    return (
        <div className={styles.card}>
            <Card title="Adicionar Transacção">
                <div className={styles.cardBody}>
                    <TransactionForm
                        onSubmit={handleSubmit}
                        submitLabel="Adicionar"
                        isPending={mutation.isPending}
                    />
                </div>
            </Card>
        </div>
    );
}