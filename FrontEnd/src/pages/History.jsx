import { useReducer } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, deleteTransaction, getCategories } from "../api";
import TransactionList from "../components/TransactionList";
import CategoryFilter from "../components/CategoryFilter";
import DateRangePicker from "../components/DateRangePicker";
import styles from "../components/styles/History.module.css";
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
    case "SET_PERIOD_TYPE":
      const period = action.payload;
      if (period === "all") {
        return { ...state, periodType: period, startDate: "", endDate: "" };
      }
      let start;

      if (period === "week") {
        const hoje = new Date();
        hoje.setDate(hoje.getDate() - 7);
        start = hoje.toISOString().split("T")[0];
        return { ...state, periodType: period, startDate: start, endDate: "" };
      }

      if (period === "month") {
        const hoje = new Date();
        hoje.setMonth(hoje.getMonth() - 1);
        start = hoje.toISOString().split("T")[0];
        return { ...state, periodType: period, startDate: start, endDate: "" };
      }

      if (period === "3months") {
        const hoje = new Date();
        hoje.setMonth(hoje.getMonth() - 3);
        start = hoje.toISOString().split("T")[0];
        return { ...state, periodType: period, startDate: start, endDate: "" };
      }

      if (period === "6months") {
        const hoje = new Date();
        hoje.setMonth(hoje.getMonth() - 6);
        start = hoje.toISOString().split("T")[0];
        return { ...state, periodType: period, startDate: start, endDate: "" };
      }

      if (period === "custom") {
        return { ...state, periodType: period };
      }
      return state;
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
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
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
      <div className={styles.topSection}>
        {/* Gráfico Detalhado */}
        <section className={styles.chartSection}>
          <ExpenseChartsHub transactions={filteredTransactions} />
        </section>

        {/* Cartão de Filtros */}
        <div className={styles.filterCard}>
          <h3 className={styles.filterTitle}>Filtros</h3>

          {/* Barra de Pesquisa */}
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

          {/* Filtros Secundários em Grid */}
          <div className={styles.dropdownsContainer}>

            {/* Componente Tipo */}
            <div className={styles.dropdownGroup}>
              <label className={styles.dropdownLabel}>Tipo</label>
              <select
                value={filter.type}
                onChange={(e) => dispatch({ type: "SET_TYPE", payload: e.target.value })}
              >
                <option value="all">Todas as Transações</option>
                <option value="income">Apenas Entradas</option>
                <option value="expense">Apenas Despesas</option>
              </select>
            </div>


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

            {/* NOVO: Dropdown do Período */}
            <div className={styles.dropdownGroup}>
              <label className={styles.dropdownLabel}>Período</label>
              <select
                className={styles.dropdownSelect}
                value={filter.periodType}
                onChange={(e) => dispatch({ type: "SET_PERIOD_TYPE", payload: e.target.value })}
              >
                <option value="all">Todo o histórico</option>
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
                <option value="3months">Últimos 3 meses</option>
                <option value="6months">Últimos 6 meses</option>
                <option value="custom">Definir período</option>
              </select>
            </div>

            {/* Botão de Limpar */}
            <div
              className={styles.dropdownGroup}
              style={{ justifyContent: "flex-end", paddingBottom: "2px" }}
            >
              <button
                  disabled={!hasActiveFilters}
                  className={
                    hasActiveFilters
                      ? styles.clearBtn
                      : styles.applyBtn
                  }
                  onClick={() => dispatch({ type: "RESET" })}
                >
                  {hasActiveFilters ? "Limpar Filtros" : "Nenhum filtro ativo"}
              </button>
            </div>
          </div>

          {/* Renderização Condicional: Só aparece se clicar em Definir Período */}
          {filter.periodType === "custom" && (
            <div className={styles.customDateWrapper}>
              <label className={styles.dropdownLabel}>Escolha o intervalo de datas</label>
              <DateRangePicker
                startDate={filter.startDate}
                endDate={filter.endDate}
                onDateChange={(start, end) =>
                  dispatch({ type: "SET_DATE_RANGE", start, end })
                }
              />
            </div>
          )}
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
