import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";

const nomesMeses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const nomesCompletosMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const TooltipCustomizado = ({ active, payload, formatCurrency }) => {
  if (!active || !payload || !payload.length) return null;

  const mesCompleto = payload[0]?.payload?.mesCompleto ?? "";

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-secondary)",
      borderRadius: "8px",
      padding: "10px 14px",
      fontSize: "13px",
      color: "var(--color-text-primary)",
    }}>
      <p style={{ fontWeight: 500, marginBottom: 6 }}>{mesCompleto}</p>
      {payload.map((entry) => (
    <p key={entry.dataKey} style={{ margin: "2px 0", color: entry.stroke }}>
      {entry.dataKey} : {formatCurrency(entry.value)}
    </p>
  ))}
    </div>
  );
};

export default function ExpenseLineChart({ transactions }) {
  const { currency } = useContext(PreferencesContext);

    const formatCurrency = (amount) => {
        const locale = currency === 'BRL' ? 'pt-BR' : 'pt-PT'

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency || 'EUR',
        }).format(amount);
    };

  const data = transactions.reduce((acumulador, transacao) => {
    const date = new Date(transacao.transaction_date.split("T")[0] + "T00:00:00"); // Garantir que é tratado como UTC 
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!acumulador[key]) {
      acumulador[key] = {
        mes: `${nomesMeses[date.getMonth()]} ${date.getFullYear()}`,
        mesCompleto: `${nomesCompletosMeses[date.getMonth()]} ${date.getFullYear()}`,
        despesas: 0,
        receitas: 0,
        order: date.getFullYear() * 12 + date.getMonth(),
      };
    }

    if (transacao.type === "expense") {
      acumulador[key].despesas += Math.abs(Number(transacao.amount));
    } else {
      acumulador[key].receitas += Number(transacao.amount);
    }

    return acumulador;
  }, {});

  const chartData = Object.values(data).sort((a, b) => a.order - b.order);

  const temDespesas = chartData.some((d) => d.despesas > 0);
  const temReceitas = chartData.some((d) => d.receitas > 0);
  
  return (
    <div style={{ position: "relative" }}>
        {chartData.length === 0 && (
            <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                fontSize: 15,
                color: "var(--color-text-secondary, #6b7280)",
                background: "rgba(255,255,255,0.6)", 
                borderRadius: 8,
            }}>
                Sem transações para mostrar.
            </div>
        )}
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        {/* ✅ currency passado como prop para o tooltip */}
        <Tooltip content={<TooltipCustomizado formatCurrency={formatCurrency} />} />
        <Legend />
        {temDespesas && (
          <Line type="monotone" dataKey="despesas" stroke="#ef4444"
            dot={{ r: 4, fill: "#ef4444" }} activeDot={{ r: 6 }} />
        )}
        {temReceitas && (
          <Line type="monotone" dataKey="receitas" stroke="#10b981"
            dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
        )}
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
}