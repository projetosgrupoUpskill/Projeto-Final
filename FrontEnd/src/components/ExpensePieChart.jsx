import { createContext, useContext, useMemo, useState } from "react";
import { Legend, RadialBar, RadialBarChart, Sector } from "recharts";

const colors = [
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
];

const SelectedLabelContext = createContext({
  selectedLabel: undefined,
  setSelectedLabel: () => {},
});

const CustomSector = (props) => {
  const { selectedLabel, setSelectedLabel } = useContext(SelectedLabelContext);
  const isSelected =
    props.payload.label === selectedLabel || selectedLabel == null;
  return (
    <Sector
      {...props}
      onClick={() => setSelectedLabel(props.payload.label)}
      fill={colors[props.index % colors.length]}
      opacity={isSelected ? 1 : 0.2}
      style={{ transition: "opacity 0.3s ease" }}
    />
  );
};

const LegendItem = ({ entry }) => {
  const { selectedLabel, setSelectedLabel } = useContext(SelectedLabelContext);
  const l = entry.payload.label;
  const isSelected = selectedLabel === l || selectedLabel == null;
  return (
    <li
      onClick={() => setSelectedLabel(l)}
      style={{
        color: entry.color,
        opacity: isSelected ? 1 : 0.2,
        transition: "opacity 0.3s ease",
        listStyle: "none",
        alignItems: "left",
        fontSize: 14,
      }}
    >
      {l}
    </li>
  );
};

const LegendContent = ({ payload }) => {
  return (
    <ul style={{ paddingTop: "16px", margin: 0, padding: 0, paddingTop: "16px" }}>
      {payload?.map((entry, index) => (
        <LegendItem key={`item-${index}`} entry={entry} />
      ))}
    </ul>
  );
};

export default function ExpensePieChart({ transactions }) {
  const [selectedRadialBar, setSelectedRadialBar] = useState(undefined);
  

  const data = Object.entries(
    transactions
      .reduce((acumulador, transacao) => {
        const amount = Math.abs(transacao.amount);
        if (acumulador[transacao.category]) {
          acumulador[transacao.category] += transacao.amount;
        } else {
          acumulador[transacao.category] = transacao.amount;
        }
        return acumulador;
      }, {}),
  ).map(([categoria, valor]) => ({ label: categoria, x: valor }));

  const providerValue = useMemo(
    () => ({
      selectedLabel: selectedRadialBar,
      setSelectedLabel: (newLabel) =>
        setSelectedRadialBar((curr) =>
          curr === newLabel ? undefined : newLabel,
        ),
    }),
    [selectedRadialBar],
  );

  return (
    <SelectedLabelContext.Provider value={providerValue}>
      <RadialBarChart
        data={data}
        style={{ width: "100%", maxWidth: "500px", aspectRatio: 2 }}
        responsive
      >
        <RadialBar
          background
          dataKey="x"
          name="foo"
          shape={CustomSector}
          cornerRadius={10}
        />
        <Legend
          iconSize={10}
          width={120}
          layout="vertical"
          verticalAlign="top"
          align="right"
          content={LegendContent}
        />
      </RadialBarChart>
    </SelectedLabelContext.Provider>
  );
}
