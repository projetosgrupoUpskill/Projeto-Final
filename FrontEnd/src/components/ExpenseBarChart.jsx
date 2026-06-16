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

export default function ExpenseBarChart({ transactions }) {
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
    <ResponsiveContainer width="100%" height={300} >
      <BarChart
      style={{ outline: "none", border: "none" }}
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        tabIndex={-1}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: 600 }} />
        <YAxis width={60} />
        <Tooltip
          formatter={(value) =>[ <strong>€{value.toFixed(2)}</strong>, ""]}
          separator=""
          cursor={{ fill: "none" }}
        />
        <Bar dataKey="valor" radius={[6, 50, 0, 0]} barSize={45} />
      </BarChart>
    </ResponsiveContainer>
  );
}
