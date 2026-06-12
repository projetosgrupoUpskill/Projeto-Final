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

    const handleSubmit = ({ description, amount, category }) => {
        mutation.mutate({
            description,
            amount,
            category,
            date: new Date().toISOString(),
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