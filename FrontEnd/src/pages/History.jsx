import { useReducer, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, deleteTransaction, getCategories } from "../api";
import { getTransactionTotals } from "../utils/transactionsTotals";
import TransactionList from "../components/TransactionList";
import CategoryFilter from "../components/CategoryFilter";
import DateRangePicker from "../components/DateRangePicker";
import Summary from "../components/Summary";
import AddTransaction from "./AddTransaction";
import styles from "../components/styles/History.module.css";
import toast from "react-hot-toast";

const initialState = {
  search: "",
  startDate: "",
  endDate: "",
  activeCategory: null,
  type: "all",
  periodType: "all",
};

function filtersReducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_DATE_RANGE":
      return { ...state, startDate: action.start, endDate: action.end };
    case "SET_CATEGORY":
      return { ...state, activeCategory: action.category };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_PERIOD_TYPE": {
      const period = action.payload;
      if (period === "all")
        return { ...state, periodType: period, startDate: "", endDate: "" };

      let start;
      if (period === "week") {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        start = d.toISOString().split("T")[0];
        return { ...state, periodType: period, startDate: start, endDate: "" };
      }
      if (period === "month") {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        start = d.toISOString().split("T")[0];
        return { ...state, periodType: period, startDate: start, endDate: "" };
      }
      if (period === "3months") {
        const d = new Date();
        d.setMonth(d.getMonth() - 3);
        start = d.toISOString().split("T")[0];
        return { ...state, periodType: period, startDate: start, endDate: "" };
      }
      if (period === "6months") {
        const d = new Date();
        d.setMonth(d.getMonth() - 6);
        start = d.toISOString().split("T")[0];
        return { ...state, periodType: period, startDate: start, endDate: "" };
      }
      if (period === "custom") return { ...state, periodType: period };
      return state;
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const Details = () => {
  const queryClient = useQueryClient();
  const [filter, dispatch] = useReducer(filtersReducer, initialState);

  const hasActiveFilters =
    filter.search !== "" ||
    filter.startDate !== "" ||
    filter.endDate !== "" ||
    filter.activeCategory !== null ||
    filter.type !== "all" ||
    filter.periodType !== "all";

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
        toast.success(data?.message || "Transação eliminada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao eliminar transação. Tente novamente.");
    },
  });

  const { income, expense, balance } = useMemo (
    () => getTransactionTotals(transactions),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
    if (
      filter.activeCategory &&
      filter.activeCategory !== "all" &&
      t.category_slug !== filter.activeCategory
    )
      return false;

    if (filter.type === "income" && t.type !== "income") return false;
    if (filter.type === "expense" && t.type !== "expense") return false;
    if (filter.startDate || filter.endDate) {
      if (!t.transaction_date) return false;
      const transactionDate = new Date(t.transaction_date);
      const start = filter.startDate ? new Date(filter.startDate) : null;
      const end = filter.endDate ? new Date(filter.endDate) : null;
      if (start && transactionDate < start) return false;
      if (end && transactionDate > end) return false;
    }
    if (filter.search) {
      const description = t.title?.toLowerCase() || "";
      if (!description.includes(filter.search.toLowerCase())) return false;
    }
    return true;
  });
}, [transactions, filter]);

  if (isLoading) return <p style={{ color: "white" }}>A carregar...</p>;
  if (isError) return <p style={{ color: "red" }}>Erro ao ligar à API.</p>;

  return (
    <div className={styles.historyContainer}>
      <Summary
        balance={balance}
        income={income}
        expense={expense}
        showGreeting={false}
      />

      {/* Filtros à esquerda, lista à direita */}
      <div className={styles.bottomSection}>
        {/* ── Filtros ── */}
        <div className={styles.filterCard}>
          <h3 className={styles.filterTitle}>Filtros</h3>

          <div className={styles.filterSection}>
            <label className={styles.dropdownLabel}>Buscar transações</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar..."
                value={filter.search}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.dropdownsContainer}>
            <div className={styles.dropdownGroup}>
              <label className={styles.dropdownLabel}>Tipo</label>
              <select
                value={filter.type}
                onChange={(e) =>
                  dispatch({ type: "SET_TYPE", payload: e.target.value })
                }
              >
                <option value="all">Todas as Transações</option>
                <option value="income">Apenas Entradas</option>
                <option value="expense">Apenas Despesas</option>
              </select>
            </div>

            <div className={styles.dropdownGroup}>
              <label className={styles.dropdownLabel}>Categoria</label>
              <CategoryFilter
                categories={categories}
                activeCategory={filter.activeCategory}
                onCategoryChange={(cat) =>
                  dispatch({ type: "SET_CATEGORY", category: cat })
                }
              />
            </div>

            <div className={styles.dropdownGroup}>
              <label className={styles.dropdownLabel}>Período</label>
              <select
                className={styles.dropdownSelect}
                value={filter.periodType}
                onChange={(e) =>
                  dispatch({ type: "SET_PERIOD_TYPE", payload: e.target.value })
                }
              >
                <option value="all">Todo o histórico</option>
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
                <option value="3months">Últimos 3 meses</option>
                <option value="6months">Últimos 6 meses</option>
                <option value="custom">Definir período</option>
              </select>
            </div>

            {filter.periodType === "custom" && (
              <div className={styles.customDateWrapper}>
                <label className={styles.dropdownLabel}>
                  Intervalo de datas
                </label>
                <DateRangePicker
                  startDate={filter.startDate}
                  endDate={filter.endDate}
                  onDateChange={(start, end) =>
                    dispatch({ type: "SET_DATE_RANGE", start, end })
                  }
                />
              </div>
            )}

            <div className={styles.dropdownGroup}>
              <button
                disabled={!hasActiveFilters}
                className={hasActiveFilters ? styles.clearBtn : styles.applyBtn}
                onClick={() => dispatch({ type: "RESET" })}
              >
                {hasActiveFilters ? "Limpar Filtros" : "Nenhum filtro ativo"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.transactionsColumn}>
          <AddTransaction />

          {/* ── Lista ── */}
          <TransactionList
            transactions={filteredTransactions}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
