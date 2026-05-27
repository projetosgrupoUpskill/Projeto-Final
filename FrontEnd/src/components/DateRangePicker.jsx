import React from 'react';

export default function DateRangePicker({ startDate, endDate, onDateChange }) {
  return (
    <div >
      <label> De: 
        <input 
        type="date" 
        value={startDate} 
        onChange={(e) => onDateChange(e.target.value, endDate)} 
        style={{ marginLeft: '0.5rem'}}/>
      </label>
      <label> Até: 
        <input 
        type="date" 
        value={endDate} 
        onChange={(e) => onDateChange(startDate, e.target.value)} 
        style={{ marginLeft: '0.5rem'}}/>
      </label>
    </div>
  );
}