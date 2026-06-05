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

const nomesMeses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export default function ExpenseLineChart({ transactions }) {
  const data = transactions.reduce((acumulador, transacao) => {
/*     const dia = transacao.date.slice(0, 10); // "2024-03"
 */
    const date = new Date(transacao.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!acumulador[key]) {
      acumulador[key] = { mes: `${nomesMeses[date.getMonth()]} ${date.getFullYear()}`, despesas: 0, receitas: 0 };
    }

    if (transacao.type === "expense") {
      acumulador[key].despesas += Math.abs(transacao.amount);
    } else {
      acumulador[key].receitas += transacao.amount;
    }

    return acumulador;
  }, {});

  const chartData = Object.values(data).sort((a, b) => a.order - b.order);

  // Verifica se existe pelo menos uma despesa ou receita na lista filtrada
  const temDespesas = chartData.some((d) => d.despesas > 0);
  const temReceitas = chartData.some((d) => d.receitas > 0); 

  return (
    <ResponsiveContainer width="100%" height='300'>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 16, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />
        {temDespesas && (
          <Line
          type="monotone"
          dataKey="despesas"
          stroke="#ef4444"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        )}
      
        {temReceitas && (
        <Line
          type="monotone"
          dataKey="receitas"
          stroke="#10b981"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
