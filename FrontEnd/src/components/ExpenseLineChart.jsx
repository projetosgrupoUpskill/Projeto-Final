import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import { ThemeContext } from "../context/ThemeContext";

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
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

    const formatCurrency = (amount) => {
        const locale = currency === 'BRL' ? 'pt-BR' : 'pt-PT'

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency || 'EUR',
        }).format(amount);
    };

  const distinctMonths = new Set(
    transactions.map((transacao) => {
      const date = new Date(transacao.transaction_date.slice(0, 10) + "T00:00:00");
      return `${date.getFullYear()}-${date.getMonth()}`;
    })
  );

  const agruparPorDia = distinctMonths.size <= 1;

  const data = transactions.reduce((acumulador, transacao) => {
    const date = new Date(transacao.transaction_date.slice(0, 10) + "T00:00:00");

    let key, label, labelCompleto, order;

    if (agruparPorDia) {
      const dia = String(date.getDate()).padStart(2, "0");
      const mes = String(date.getMonth() + 1).padStart(2, "0");

      key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      label = `${dia}/${mes}`;
      labelCompleto = `${date.getDate()} de ${nomesCompletosMeses[date.getMonth()]} de ${date.getFullYear()}`;
      order = date.getTime();
    } else {
      key = `${date.getFullYear()}-${date.getMonth()}`;
      label = `${nomesMeses[date.getMonth()]} ${date.getFullYear()}`;
      labelCompleto = `${nomesCompletosMeses[date.getMonth()]} ${date.getFullYear()}`;
      order = date.getFullYear() * 12 + date.getMonth();
    }

    if (!acumulador[key]) {
      acumulador[key] = {
        mes: label,
        mesCompleto: labelCompleto,
        despesas: 0,
        receitas: 0,
        order,
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
    <div style={{ position: "relative", height: "100%" }}>
        {chartData.length === 0 && (
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
                Ainda não há transações para mostrar.
            </div>
        )}
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 0, right: 16, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" tickMargin={14} />
        <YAxis />
        <Tooltip content={<TooltipCustomizado formatCurrency={formatCurrency} />} />
        <Legend wrapperStyle={{ paddingTop: 16 }}/>
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