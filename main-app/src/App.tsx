import { useState } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState<number | null>(null);
  const [printResult, setPrintResult] = useState("");

  const handlePrint = async () => {
    if (amount === null) return;

    try {
      // Fetch the voucher code from the backend
      const voucherCode = "123-456-789"; // This should be replaced with actual logic to fetch the voucher code
      const result = await window.api.print(voucherCode);
      setPrintResult(result);
    } catch (err) {
      setPrintResult("Print failed");
      console.error(err);
    }
  };

  return (
    <>
      <div className="card">
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => setAmount(500)}>500 RSD</button>
          <button
            onClick={() => setAmount(1000)}
            style={{ marginLeft: "1rem" }}
          >
            1000 RSD
          </button>
        </div>
        <button onClick={handlePrint} disabled={amount === null}>
          Print
        </button>
        <p>Print Result: {printResult}</p>
        {amount && <p>Selected Amount: {amount} RSD</p>}
      </div>
    </>
  );
}

export default App;
