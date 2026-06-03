import { useReducer } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, deleteTransaction, getCategories } from "../api";
import TransactionList from "../components/TransactionList";
import CategoryFilter from "../components/CategoryFilter";
import DateRangePicker from "../components/DateRangePicker";
import styles from "../components/styles/History.module.css";
import ExpenseChart from "../components/ExpenseChart";
import ExpenseChartsHub from "../components/ExpenseChartsHub.jsx";

const prepareStackedData = (transactions, categories) => { 
  const totals = transactions.reduce((acc, curr) => { 
    const slug = curr.category.toLowerCase(); 
    const amount = Math.abs(curr.amount); 

    if (!acc[slug]) acc[slug] = { income: 0, expense: 0 }; 

    if (curr.amount > 0) acc[slug].income += amount;
    else acc[slug].expense += amount; 

    return acc;
  }, {});

  return Object.keys(totals).map((slug) => {
    const catInfo = categories.find((c) => c.slug === slug);
    return {
      name: catInfo ? catInfo.label : slug,
      receita: totals[slug].income,
      despesa: totals[slug].expense,
    };
  });
};

const initialState = {
  search: "",
  startDate: "",
  endDate: "",
  activeCategory: null,
  type: "all",
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
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const Details = () => {
  const queryClient = useQueryClient();
  const [filter, dispatch] = useReducer(filtersReducer, initialState);

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => queryClient.invalidateQueries({queryKey:['transactions']}),
  });

  if (isLoading) return <p style={{ color: "white" }}>A carregar...</p>;
  if (isError) return <p style={{ color: "red" }}>Erro ao ligar à API.</p>;

  const filteredTransactions =
    transactions?.filter((t) => {
      // Filtro de Categoria
      if (
        filter.activeCategory &&
        filter.activeCategory !== "all" &&
        t.category !== filter.activeCategory
      )
        return false;

      // Filtro de Tipo (opcional, se usar)
      if (filter.type === "income" && t.amount <= 0) return false;
      if (filter.type === "expense" && t.amount >= 0) return false;

      // Filtro de Datas
      if (t.date) {
        const transactionDate = t.date.split("T")[0];
        if (filter.startDate && transactionDate < filter.startDate)
          return false;
        if (filter.endDate && transactionDate > filter.endDate) return false;
      }

      // Filtro de Pesquisa (por descrição)
      if (filter.search) {
        const description =
          t.description?.toLowerCase() || t.title?.toLowerCase() || "";
        if (!description.includes(filter.search.toLowerCase())) return false;
      }

      return true;
    }) || [];

  return (
    <div className={styles.historyContainer}>
      {/* Gráfico Detalhado */}
      <section className={styles.chartSection}>
        <h2 style={{ marginBottom: "1rem" }}>Fluxo por Categoria</h2>
        <ExpenseChartsHub transactions={filteredTransactions} />
      </section>

      <br />
      {/* Cartão de Filtros */}
      <div className={styles.filterCard}>
        {/* Barra de Pesquisa */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar transação..."
            value={filter.search}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
          />
        </div>

        {/* Filtros Secundários em Grid */}
        <div className={styles.dropdownsContainer}>
          {/* Componente Categoria */}
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

          {/* Componente Datas */}
          <div className={styles.dropdownGroup}>
            <label className={styles.dropdownLabel}>Período</label>
            <DateRangePicker
              startDate={filter.startDate}
              endDate={filter.endDate}
              onDateChange={(start, end) =>
                dispatch({ type: "SET_DATE_RANGE", start, end })
              }
            />
          </div>

          {/* Botão de Limpar */}
          <div
            className={styles.dropdownGroup}
            style={{ justifyContent: "flex-end", paddingBottom: "2px" }}
          >
            <button
              className={`${styles.clearBtn}`}
              onClick={() => dispatch({ type: "RESET" })}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de transações sem os filtros embutidos */}
      <TransactionList
        transactions={filteredTransactions}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </div>
  );
};

export default Details;
