import { useState } from "react";
import { LineChart, Line } from "recharts";
import ExpenseLineChart from "./ExpenseLineChart.jsx";
import ExpensePieChart from "./ExpensePieChart.jsx";

const TABS = [
  { id: "fluxo", label: "Fluxo Financeiro" },
  { id: "categorias", label: "Gastos por Categoria" },
];

export default function ExpenseChartsHub({ transactions }) {
  const [activeTab, setActiveTab] = useState("fluxo");


  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        fontFamily: "sans-serif",
        width:  '50%',
        margin: "32px auto",
      }}
    >
      {/* Abas */}
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
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
                  ? "2px solid #111827"
                  : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                fontSize: 15,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#111827" : "#9ca3af",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Área reservada para os gráficos filhos */}
      <div style={{ padding: 24, minHeight: 200, height: 320 }}>
          {activeTab === "fluxo" ? <ExpenseLineChart transactions={transactions} /> : <ExpensePieChart transactions={transactions}/>}
      </div>
    </div>
  );
}

