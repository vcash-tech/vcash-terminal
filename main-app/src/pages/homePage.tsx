import { useState, useEffect } from "react";

function HomePage() {
  const [amount, setAmount] = useState<number | null>(null);
  const [printResult, setPrintResult] = useState("");
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("pos_token");
    setHasToken(!!token);
  }, []);

  const handlePrint = async () => {
    if (amount === null) return;

    try {
      const voucherCode = "123-456-789"; // Replace with actual logic
      const result = await window.api.print(voucherCode);
      setPrintResult(result);
    } catch (err) {
      setPrintResult("Print failed");
      console.error(err);
    }
  };

  return (
    <div className="card">
      {hasToken ? (
        <>
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
        </>
      ) : (
        <></>
        //<RegisterDevice />
      )}
    </div>
  );
}

export default HomePage;
