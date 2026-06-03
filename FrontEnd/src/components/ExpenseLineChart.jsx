import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseLineChart({ transactions }) {
  const data = transactions.reduce((acumulador, transacao) => {
    const dia = transacao.date.slice(0, 10); // "2024-03"

    if (!acumulador[dia]) {
      acumulador[dia] = { dia, despesas: 0, receitas: 0 };
    }

    if (transacao.type === "expense") {
      acumulador[dia].despesas += Math.abs(transacao.amount);
    } else {
      acumulador[dia].receitas += transacao.amount;
    }

    return acumulador;
  }, {});

  const chartData = Object.values(data);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 16, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dia" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="despesas"
          stroke="#ef4444"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="receitas"
          stroke="#10b981"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
