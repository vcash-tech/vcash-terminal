import { CircularProgress } from "@mui/material"
import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"

import CashierSelect from "../components/cashierSelect"
import { AuthService } from "../services/authService"
import { TransactionService } from "../services/transactionService"
import { Auth } from "../types/common/httpRequest"

function HomePage() {
  const [amount, setAmount] = useState<number | null>(null)
  const [printResult, setPrintResult] = useState("")
  const [hasCashierToken, setHasCashierToken] = useState<boolean>(false)
  const [loader, setLoader] = useState<boolean>(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = AuthService.GetToken(Auth.POS)
    if (!token) {
      navigate("/register")
    }
  }, [navigate])

  useEffect(() => {
    const token = AuthService.GetToken(Auth.Cashier)
    setHasCashierToken(!!token)
  }, [navigate])

  const handleBuy = async () => {
    if (amount === null) return

    setLoader(true)
    try {
      const voucherData = await TransactionService.CreateVoucher({
        amount: amount,
      })
      const voucherCodeDefault = "123-456-789" // Replace with actual logic
      const result = await window.api.print(
        voucherData.moneyTransfer.voucherCode || voucherCodeDefault
      )
      setPrintResult(result)
    } catch (err) {
      setPrintResult("Print failed")
      console.error(err)
    }
    setLoader(false)
  }

  return (
    <div className="card">
      {hasCashierToken ? (
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
          <button onClick={handleBuy} disabled={amount === null}>
            Buy
          </button>
          {loader && <CircularProgress />}
          <p>Voucher code: {printResult}</p>
          {amount && <p>Selected Amount: {amount} RSD</p>}
        </>
      ) : (
        <CashierSelect setHasCashierToken={setHasCashierToken} />
      )}
    </div>
  )
}

export default HomePage
