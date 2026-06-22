import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, deleteTransaction } from "../api";
import { getTransactionTotals } from "../utils/TransactionTotals.js";
import Summary from "../components/Summary";
import TransactionList from "../components/TransactionList";
import ExpenseLineChart from "../components/ExpenseLineChart";
import ExpenseBarChart from "../components/ExpenseBarChart";
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

  if (isLoading) return <p style={{ color: "white" }}>A carregar...</p>;
  if (isError) return <p style={{ color: "red" }}>Erro ao ligar à API.</p>;

  const { income, expense, balance } = getTransactionTotals(transactions);

  const lastSevenTransactions = [...transactions]
    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
    .slice(0, 7);

  return (
    <>
      <Summary balance={balance} income={income} expense={expense} />

      <div className={styles.gridTwoColumns}>
        <div className={styles.chartsColumn}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Fluxo Financeiro</h3>
            <div className={styles.chartBody}>
              <ExpenseLineChart transactions={transactions} />
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Despesas por Categoria</h3>
            <div className={styles.chartBody}>
              <ExpenseBarChart transactions={transactions} />
            </div>
          </div>
        </div>

        <div className={styles.transactionsColumn}>
          <TransactionList
            transactions={lastSevenTransactions}
            showPagination={false}
            showActions={false}
            title="Transações Recentes"
            viewAllLink="/details"
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;