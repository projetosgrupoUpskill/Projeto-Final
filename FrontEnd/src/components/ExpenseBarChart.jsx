import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ExpenseBarChart({ transactions }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const colorMap = transactions.reduce((acc, t) => {
    if (t.category_name && t.category_color) {
      acc[t.category_name] = t.category_color;
    }
    return acc;
  }, {});

  const data = Object.entries(
    transactions
    .filter((t) => t.type === "expense")
    .reduce((acumulador, transacao) => {

      const categoria = transacao.category_name;

      if (!categoria) return acumulador;
      acumulador[categoria] =
        (acumulador[categoria] || 0) + Math.abs(transacao.amount);
      
        return acumulador;
    }, {}),
    
  ).map(([categoria, valor]) => ({
    name: categoria,
    valor,
    fill: colorMap[categoria] ?? "#5a5a63",
  }));

  return (
    <div style={{ position: "relative", height: "100%" }}>
        {data.length === 0 && (
            <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                fontSize: 15,
                color: isDark ? "#9ca3af" : "#6b7280",
                background: isDark ? "rgba(30, 30, 30, 0.75)" : "rgba(255,255,255,0.6)",
                borderRadius: 8,
            }}>
                Ainda não há despesas registadas.
            </div>
        )}
    <ResponsiveContainer width="100%" height="100%" >
      <BarChart
      style={{ outline: "none", border: "none" }}
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 5 }}
        tabIndex={-1}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          interval={0}
          angle={-45}
          textAnchor="end"
          height={70} 
          tick={{ fontSize: 10.5, fontWeight: 500 }} />
        <YAxis width={50} />
        <Tooltip
          formatter={(value) =>[ <strong>€{value.toFixed(2)}</strong>, ""]}
          separator=""
          cursor={{ fill: "none" }}
        />
        <Bar dataKey="valor" radius={[6, 50, 0, 0]} barSize={25} />
      </BarChart>
    </ResponsiveContainer>
      </div>
  );
}