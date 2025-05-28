import { useState } from "react";
import "./App.css";

function App() {
  const [printResult, setPrintResult] = useState("");

  const handlePrint = async () => {
    try {
      const result = await window.api.print();
      setPrintResult(result);
    } catch (err) {
      setPrintResult("Print failed");
      console.error(err);
    }
  };

  return (
    <>
      <div className="card">
        <button onClick={handlePrint}>Print</button>
        <p>Print Result: {printResult}</p>
      </div>
    </>
  );
}

export default App;
