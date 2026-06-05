import { useState } from "react";
import { LineChart, Line } from "recharts";
import ExpenseLineChart from "./ExpenseLineChart.jsx";
import ExpensePieChart from "./ExpensePieChart.jsx";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const TABS = [
  { id: "fluxo", label: "Fluxo Financeiro" },
  { id: "categorias", label: "Gastos por Categoria" },
];

export default function ExpenseChartsHub({ transactions }) {
  const [activeTab, setActiveTab] = useState("fluxo");
  const { theme } = useContext(ThemeContext); 

  const isDark = theme === "dark";

  return (
    <div
      style={{
        background: isDark ? "#1e1e1e" : "#ffffff", 
        border: isDark ? "1px solid #3f3f46" : "1px solid #e5e4e7",
        borderRadius: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        fontFamily: "sans-serif",
        width:  '100%',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Abas */}
      <div style={{ display: "flex", borderBottom: isDark ? "1px solid #3f3f46" : "1px solid #e5e4e7" }}>       
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "16px 0",
                background: "none",
                border: "none",
                borderBottom: isActive
                  ? `2px solid ${isDark ? "#ffffff" : "#08060d"}`
                  : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                fontSize: 15,
                fontWeight: isActive ? 600 : 400,
                color: isActive 
                  ? (isDark ? "#ffffff" : "#08060d") 
                  : (isDark ? "#9ca3af" : "#6b6375"),
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Área reservada para os gráficos filhos */}
      <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column',minHeight: 300 }}>
          {activeTab === "fluxo" ? <ExpenseLineChart transactions={transactions} /> : <ExpensePieChart transactions={transactions}/>}
      </div>
    </div>
  );
}

