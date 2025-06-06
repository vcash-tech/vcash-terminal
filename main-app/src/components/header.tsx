import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { Auth } from "../types/common/httpRequest";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.DeleteToken(Auth.POS);
    AuthService.DeleteToken(Auth.Cashier);
    navigate("/register");
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
