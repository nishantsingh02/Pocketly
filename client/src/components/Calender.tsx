// Calender.tsx
import React from "react";

interface CalenderProps {
  onChange: (date: Date) => void;
}

const Calender: React.FC<CalenderProps> = ({ onChange }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(e.target.value)); // Passes the selected date to the parent component
  };

  return (
    <div>
      <input type="date" onChange={handleDateChange} />
    </div>
  );
};

export default Calender;











/*import React, { useState } from "react";

interface CalenderProps {

  onChange: (date: Date) => void;

}

const Calender : React.FC<CalenderProps> = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState("");

interface DateChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

const handleDateChange = (event: DateChangeEvent) => {
    setSelectedDate(event.target.value);
};
  
  /*const handleAddDate = () => {
    if (selectedDate) {
      //alert(`Date added: ${selectedDate}`);
      setSelectedDate(""); // Clear the input after adding
    } else {
      alert("Please select a date first.");
    }
  };*//*

  return (
    <div style={{ textAlign: "center", marginTop: "2px", marginBottom: "8px" }}>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        style={{ padding: "10px", fontSize: "16px" }}
      />
    </div>
  );
};

export default Calender;*/