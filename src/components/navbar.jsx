import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useKeycloak } from "../keycloak-provider";

export default function Navbar() {
  const { keycloak, authenticated, logout } = useKeycloak();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/app">TodoList</Link>
      <Link to="/about">NotYetImplemented</Link>
      <Link to="/contact">NotYetImplemented</Link>
      
      {authenticated && keycloak && (
        <>
          <span style={{ marginLeft: 'auto', marginRight: '10px' }}>
            Welcome, {keycloak.tokenParsed?.preferred_username}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}