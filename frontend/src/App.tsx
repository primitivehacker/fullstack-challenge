import React, { useEffect, useState } from "react";

const App = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`/api/organizations/1/deals`);
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
        setDeals(data.deals);
        setTotalValue(data.totalValue);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDeals();
  });

  return (
    <div>
      <h1>Deals for Organization</h1>
      <div>
        <label>Status: </label>
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div>
        <label>Year: </label>
        <input
          type="number"
          placeholder="Enter year"
          onChange={(e) => setYearFilter(e.target.value)}
          value={yearFilter}
        />
      </div>
      <h2>Total Value: ${totalValue.toFixed(2)}</h2>
      <ul>
        {deals.map((deal) => (
          <li key={deal.id}>
            {deal.account_name} - {deal.value} ({deal.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
