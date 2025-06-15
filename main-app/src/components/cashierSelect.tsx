import { useEffect, useState } from "react";
import { POSService } from "../services/posService";
import { Cashier } from "../types/pos/cashier";
import { Auth } from "../types/common/httpRequest";
import { AuthService } from "../services/authService";
import { CircularProgress } from "@mui/material";

interface Props {
  setHasCashierToken: (hasToken: boolean) => void;
}

export default function CashierSelect({ setHasCashierToken }: Props) {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [PIN, setPIN] = useState<number>(0);
  const [selectedCashier, setSelectedCashier] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    const fetchCashiers = async () => {
      setLoader(true);
      try {
        const cashiersResponse = await POSService.getCashiersPOS();
        setCashiers(cashiersResponse.cashiers);
      } catch (error) {
        console.error("Error fetching cashiers:", error);
      }
      setLoader(false);
    };
    fetchCashiers();
  }, []);

  const handleUnlock = async () => {
    try {
      const response = await POSService.unlockDevice({
        userName: cashiers[selectedCashier].userName,
        pin: PIN.toString(),
      });
      AuthService.SetToken(Auth.Cashier, response.accessToken);
      // Handle successful unlock, e.g., redirect or show success message
      console.log("Device unlocked successfully");
      setHasCashierToken(true);
    } catch (error) {
      console.error("Error unlocking device:", error);
      // Handle error, e.g., show error message
    }
  };

  return (
    <div>
      {loader && <CircularProgress />}
      {cashiers.map((cashier: Cashier, idx: number) => (
        <div
          style={{
            color: selectedCashier === idx ? "ghostwhite" : "rebeccapurple",
          }}
          onClick={() => setSelectedCashier(idx)}
        >
          {cashier.userName}
        </div>
      ))}

      <input
        type="number"
        value={PIN}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e: any) => setPIN(e.target.value)}
      ></input>

      <button type="button" onClick={handleUnlock}>
        Unlock
      </button>
    </div>
  );
}
