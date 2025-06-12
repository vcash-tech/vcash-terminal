import { useState, useRef } from "react";
import { POSService } from "../services/posService";
import { AuthService } from "../services/authService";
import { Auth } from "../types/common/httpRequest";
import { getErrorInfo } from "../helpers/getErrorInfo";
import { LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

enum DeviceTokenSteps {
  getCode,
  gettingToken,
  gotToken,
}

const BRAND_NAME = import.meta.env.VITE_BRAND_NAME;

function RegisterPage() {
  const [agentEmail, setAgentEmail] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [stepper, setStepper] = useState<DeviceTokenSteps>(
    DeviceTokenSteps.getCode
  );
  const stepperRef = useRef<DeviceTokenSteps>(stepper);

  const [loader, setLoader] = useState<boolean>(false);

  const navigate = useNavigate();

  stepperRef.current = stepper;

  async function getDeviceToken(agentId: string, deviceCode: string) {
    try {
      const deviceTokenResponse = await POSService.generateDeviceToken({
        agentId: agentId,
        deviceCode: deviceCode,
      });

      setStepper(DeviceTokenSteps.gotToken);
      AuthService.SetToken(Auth.POS, deviceTokenResponse.token);
    } catch (err: any) {
      const { code, description } = getErrorInfo(err);

      if (
        code === "DEVICE_NOT_AUTHORIZED" &&
        stepperRef.current === DeviceTokenSteps.gettingToken
      ) {
        setTimeout(() => getDeviceToken(agentId, deviceCode), 10000);
        return;
      }
      if (stepperRef.current !== DeviceTokenSteps.getCode) {
        // enqueueSnackbar(
        //     "Greška pri kreiranju tokena za uređaj. Molim Vas unesite podatke i pokušajte ponovo.",
        //     { variant: "error" },
        // );
      }
      setStepper(DeviceTokenSteps.getCode);
    } finally {
      setLoader(false);
    }
  }

  const handleRegisterDevice = async () => {
    setLoader(true);
    try {
      const deviceCodeResponse = await POSService.generateDeviceCodeEmail({
        agentEmail,
        deviceName,
        deviceTypeId: 20,
      });
      setStepper(DeviceTokenSteps.gettingToken);
      getDeviceToken(deviceCodeResponse.agentId, deviceCodeResponse.deviceCode);
    } catch (err: any) {
      const {} = getErrorInfo(err);

      // enqueueSnackbar(
      //     `Greška pri kreiranju koda za uređaj. ${description} `,
      //     { variant: "error" },
      // );
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="card">
      <div className="flex flex-col h-full last:pb-[8rem]">
        <div className="flex justify-center desktop:justify-start w-full pt-12 pb-6">
          <span className="text-5xl text-center">Registracija uređaja</span>
        </div>

        {/* Form and Button container */}
        {stepperRef.current === DeviceTokenSteps.getCode && (
          <div className={`flex flex-col h-full gap-y-12 justify-center px-8`}>
            {/* Form */}
            <div className="flex flex-col justify-center gap-y-4 w-full">
              <div className={`flex items-center relative`}>
                <svg
                  className={`${
                    agentEmail ? "opacity-100" : "opacity-60"
                  } transition-all absolute left-4 block w-8 h-8 opacity-60`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <input
                  id="agentId"
                  autoCorrect="false"
                  onChange={(e) => setAgentEmail(e.target.value)}
                  className={`bg-transparent text-xl h-16 pl-16 pr-4 border w-full border-border rounded-xl transition duration-300 laptop:hover:border-icon/100 focus:border-secondary`}
                  type="email"
                  placeholder="Email Agenta"
                  value={agentEmail}
                ></input>
              </div>

              <div className={`flex items-center relative`}>
                <svg
                  className={`${
                    deviceName ? "opacity-100" : "opacity-60"
                  } transition-all absolute left-4 block w-8 h-8 opacity-60`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <input
                  id="deviceName"
                  autoCorrect="false"
                  onChange={(e) => setDeviceName(e.target.value)}
                  className={`bg-transparent text-xl h-16 px-16 border w-full border-border rounded-xl transition duration-300 laptop:hover:border-icon/100 focus:border-secondary`}
                  type="text"
                  placeholder="Ime uređaja"
                  value={deviceName}
                ></input>
              </div>
            </div>

            <button
              onClick={handleRegisterDevice}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "0.5rem 1rem",
              }}
            >
              Register Device
            </button>
          </div>
        )}

        {stepperRef.current === DeviceTokenSteps.gettingToken && (
          <div
            className={`flex flex-col h-full gap-y-12 justify-center realtive`}
          >
            <div className="flex flex-col justify-center px-8">
              <div className="text-4xl text-primary w-full text-center">
                Čeka se odobrenje
              </div>

              <div className="w-full text-center text-secondary-text text-xl mt-12">
                Odobrenje uređaja je trenutno na čekanju, dok se ne odobri od
                strane Agenta iz {BRAND_NAME} mreže.
              </div>

              {/* <div className="flex justify-center mt-16">
                          <span
                              className="text-link text-2xl cursor-pointer p-4"
                              onClick={() =>
                                  setStepper(DeviceTokenSteps.getCode)
                              }
                          >
                              Pokušaj ponovo
                          </span>
                      </div> */}
            </div>

            <div className="h-auto w-full absolute bottom-0">
              <LinearProgress className="h-3" color="primary"></LinearProgress>
            </div>
          </div>
        )}

        {stepperRef.current === DeviceTokenSteps.gotToken && (
          <div
            className={`flex flex-col h-full pt-8 gap-y-24 justify-center px-8`}
          >
            <div className="flex flex-col justify-center gap-y-8">
              <div className="text-4xl text-success w-full text-center">
                Uspešna registracija
              </div>

              <div className="w-full text-center text-secondary-text text-xl">
                Uređaj je uspešno registrovan. Dobro došli u {BRAND_NAME} mrežu.
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "0.5rem 1rem",
              }}
            >
              Nastavi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
