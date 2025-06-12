import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("pos_token");
    navigate("/register");
  };

  return (
    <header style={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
