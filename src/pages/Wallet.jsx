import { useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/wallet.css";

export default function Wallet() {

  const [amount, setAmount] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [utr, setUtr] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= OPEN QR =================
  const openQR = () => {
    setError("");

    if (!amount || Number(amount) < 100) {
      setError("Minimum recharge amount is ₹100");
      return;
    }

    setShowQR(true);
  };

  // ================= SUBMIT PAYMENT =================
  const handleSubmit = async () => {

    setError("");

    if (!utr.trim()) {
      setError("Please enter UTR number");
      return;
    }

    if (!file) {
      setError("Please upload payment screenshot");
      return;
    }

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("utr_number", utr);
    formData.append("screenshot", file);

    try {
      setLoading(true);

      await API.post("wallet/submit-manual-payment/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Payment submitted successfully. Waiting for admin approval.");

      // Reset everything
      setShowQR(false);
      setAmount("");
      setUtr("");
      setFile(null);

    } catch (err) {
      setError(err.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <Topbar />

        <div className="wallet-page">

          {!showQR ? (
            <div className="wallet-card-premium">

              <h2>Add Money to Wallet</h2>

              <div className="amount-input-box">
                <span>₹</span>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {error && <p className="error-text">{error}</p>}

              <button
                type="button"
                className="primary-btn"
                onClick={openQR}
              >
                Continue to Pay
              </button>

            </div>
          ) : (
            <div className="upi-payment-card">

              <div className="upi-header">
                <p>NATH SEVAONE PAYMENT</p>
                <h3>UPI Payment Request</h3>
                <span>Scan & Pay Using PhonePe</span>
              </div>

              <div className="amount-display">
                ₹{amount}.00
              </div>

              <div className="qr-box">
                <img src="/qr-code.jpeg" alt="QR Code" />
              </div>

              <div className="upload-section">

                <input
                  type="text"
                  placeholder="Enter UTR Number"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                {error && <p className="error-text">{error}</p>}

                <button
                  type="button"
                  className="verify-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Verify Payment"}
                </button>

              </div>

              <p className="secure-text">
                🔒 Secure UPI Payment
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}