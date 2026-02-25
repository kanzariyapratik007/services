import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/transactionDetails.css";

export default function TransactionDetails() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");

    axios.get("http://127.0.0.1:8000/api/wallet/transactions/", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setTransactions(res.data.results);
      setFiltered(res.data.results);
    })
    .catch(err => console.log(err));

  }, []);

  useEffect(() => {
    const result = transactions.filter(tx =>
      tx.order_id.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, transactions]);

  const totalCredit = filtered
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDebit = filtered
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="transaction-page">

          <h2 className="page-title">Transaction History</h2>

          {/* SUMMARY CARDS */}
          <div className="summary-grid">

            <div className="summary-card">
              <h4>Total Credit</h4>
              <h2>₹{totalCredit}</h2>
            </div>

            <div className="summary-card">
              <h4>Total Debit</h4>
              <h2>₹{Math.abs(totalDebit)}</h2>
            </div>

            <div className="summary-card">
              <h4>Net Balance Change</h4>
              <h2>₹{totalCredit + totalDebit}</h2>
            </div>

          </div>

          {/* SEARCH */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Balance Before</th>
                  <th>Balance After</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((tx, index) => (
                  <tr key={index}>
                    <td>{new Date(tx.created_at).toLocaleString()}</td>
                    <td>{tx.order_id}</td>

                    <td className={tx.amount > 0 ? "credit" : "debit"}>
                      ₹{tx.amount}
                    </td>

                    <td>
                      <span className={`status ${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>

                    <td>₹{tx.balance_before}</td>
                    <td>₹{tx.balance_after}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <p className="no-data">No transactions found</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
