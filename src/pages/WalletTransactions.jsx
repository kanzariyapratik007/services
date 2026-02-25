import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/walletTransactions.css";

export default function WalletTransactions() {

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  // ================= FETCH FUNCTION =================
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (search) {
        params.append("search", search);
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/api/wallet/transactions/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = res.data.results || res.data;

      setTransactions(data);
      setFiltered(data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchTransactions();
  }, []);

  // ================= TOTAL CALC =================
  const totalAmount = filtered.reduce(
    (sum, tx) => sum + Number(tx.amount),
    0
  );

  // ================= RESET =================
  const handleReset = () => {
    setStatusFilter("all");
    setSearch("");
    fetchTransactions();
  };

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <Topbar />

        <div className="transaction-page">

          {/* ===== Breadcrumb ===== */}
          <div className="breadcrumb">
            <h2>Wallet Transactions</h2>
            <span>Home / Wallet Topup History</span>
          </div>

          {/* ===== Filter Section ===== */}
          <div className="filter-box">

            <div className="filter-group">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Success</option>
                <option value="pending">Pending</option>
                <option value="rejected">Failed</option>
              </select>
            </div>

            <button className="apply-btn" onClick={fetchTransactions}>
              Apply Filters
            </button>

            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>

          </div>

          {/* ===== Summary Cards ===== */}
          <div className="summary-cards">

            <div className="card today">
              <h4>Total Transactions</h4>
              <h2>{filtered.length}</h2>
              <p>₹{totalAmount}</p>
            </div>

            <div className="card success">
              <h4>Successful</h4>
              <h2>{filtered.filter(tx => tx.status === "approved").length}</h2>
              <p>
                ₹{
                  filtered
                    .filter(tx => tx.status === "approved")
                    .reduce((s, t) => s + Number(t.amount), 0)
                }
              </p>
            </div>

            <div className="card pending">
              <h4>Pending</h4>
              <h2>{filtered.filter(tx => tx.status === "pending").length}</h2>
            </div>

            <div className="card failed">
              <h4>Failed</h4>
              <h2>{filtered.filter(tx => tx.status === "rejected").length}</h2>
            </div>

          </div>

          {/* ===== Table Section ===== */}
          <div className="table-wrapper">

            <div className="table-header">
              <h3>Wallet Topup Transactions</h3>
              <span>
                Showing {filtered.length} transactions | Total ₹{totalAmount}
              </span>
            </div>

            <div className="search-row">
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
              />
              <button onClick={fetchTransactions}>Search</button>
            </div>

            {loading ? (
              <p className="loading">Loading transactions...</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Order ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((tx, i) => (
                      <tr key={i}>
                        <td>
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="order-id">
                          {tx.order_id}
                        </td>
                        <td className="amount">
                          ₹{tx.amount}
                        </td>
                        <td>
                          <span className={`status ${tx.status}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <p className="no-data">No transactions found</p>
                )}
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}