import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StockChart = ({ data, name }) => {
  return (
    <LineChart width={600} height={400} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="open" stroke="#8884d8" />
      <Line type="monotone" dataKey="high" stroke="#82ca9d" />
      <Line type="monotone" dataKey="low" stroke="#ffc658" />
      <Line type="monotone" dataKey="close" stroke="#82ca9d" />
    </LineChart>
  );
};

const StockForm = ({ onSubmit, label }) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(symbol);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {label} Stock Symbol:
        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

function App() {
  const [symbol1, setSymbol1] = useState('MSFT');
  const [symbol2, setSymbol2] = useState('AAPL');
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  useEffect(() => {
    const fetchData = async (symbol, setData) => {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=VW45FHQR6A3PREU6`
      );
      const rawData = response.data['Time Series (Daily)'];
      const chartData = [];
      console.log(response)
      for (let date in rawData) {
        chartData.push({
          date: date,
          open: parseFloat(rawData[date]['1. open']),
          high: parseFloat(rawData[date]['2. high']),
          low: parseFloat(rawData[date]['3. low']),
          close: parseFloat(rawData[date]['4. close'])
        });
      }

      setData(chartData.reverse());
    };

    fetchData(symbol1, setData1);
    fetchData(symbol2, setData2);
  }, [symbol1, symbol2]);

  return (
    <div>
      <h1>Stock Chart</h1>
      <StockForm onSubmit={setSymbol1} label="First" />
      <StockChart data={data1} name={symbol1} />
      <StockForm onSubmit={setSymbol2} label="Second" />
      <StockChart data={data2} name={symbol2} />
    </div>
  );
}

export default App;
