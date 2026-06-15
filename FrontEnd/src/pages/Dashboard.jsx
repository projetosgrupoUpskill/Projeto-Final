import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getTransactions, deleteTransaction } from "../api";
import Summary from "../components/Summary";
import TransactionList from "../components/TransactionList";
import AddTransaction from "./AddTransaction";
import styles from "../App.module.css";

const Dashboard = () => {
  const queryClient = useQueryClient();

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  if (isLoading) return <p style={{ color: "white" }}>A carregar...</p>;
  if (isError) return <p style={{ color: "red" }}>Erro ao ligar à API.</p>;

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  const lastFiveTransactions = [...transactions]
  .sort ((a, b) => new Date (b.transaction_date) - new Date (a.transaction_date))
  .slice(0, 5);

  return (
    <>
      <Summary balance={balance} income={income} expense={expense} />

      <div className={styles.gridTwoColumns}>
        <div className={styles.listColumn}>
          <TransactionList
            transactions={lastFiveTransactions}
            onDelete={(id) => deleteMutation.mutate(id)}
            showPagination={false}
            title="Últimas Transações"
          />
        </div>

        <div className={styles.formColumn}>
          <AddTransaction />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
