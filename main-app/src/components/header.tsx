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
    <header style={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
