import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
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

export default function ExpenseChart({ data }) {
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  // Define your color tokens here
  const colors = {
    background: isDark ? "#1f2937" : "#ffffff",
    text: isDark ? "#f9fafb" : "#444444",
    grid: isDark ? "#444444" : "#e5e7eb",
    cursor: isDark ? "#70707048" : "#00000015",
    tooltipBg: isDark ? "#333333" : "#ffffff",
    tooltipText: isDark ? "#ffffff" : "#111111",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        backgroundColor: colors.background,
        borderRadius: "8px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={colors.grid}
          />
          <XAxis dataKey="name" tick={{ fill: colors.text }} />
          <YAxis
            tick={{ fill: colors.text }}
            tickFormatter={(value) => `${value}€`}
          />
          <Tooltip
            cursor={{ fill: colors.cursor }}
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              borderRadius: "5px",
              color: colors.tooltipText,
            }}
          />
          <Legend wrapperStyle={{ color: colors.text }} />
          <Bar
            dataKey="despesa"
            stackId="a"
            fill="#EF4444"
            radius={[2, 2, 0, 0]}
            name="Despesas"
            barSize={70}
          />
          <Bar
            dataKey="receita"
            stackId="a"
            fill="#10B981"
            radius={[10, 10, 0, 0]}
            name="Receitas"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}