import React from 'react';

export default function DateRangePicker({ startDate, endDate, onDateChange }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onDateChange(e.target.value, endDate)}
        style={{ flex: 1, minWidth: 0, fontSize: "0.78rem", padding: "0.3rem 0.4rem", border: "1px solid #ccc", borderRadius: "6px" }}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => onDateChange(startDate, e.target.value)}
        style={{ flex: 1, minWidth: 0, fontSize: "0.78rem", padding: "0.3rem 0.4rem", border: "1px solid #ccc", borderRadius: "6px" }}
      />
    </div>
  );
}