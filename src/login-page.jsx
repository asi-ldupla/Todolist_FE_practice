import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KeycloakContext } from "./keycloak-provider.jsx";

export default function LoginPage() {
  const { keycloak, authenticated } = useContext(KeycloakContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to todo app
    if (authenticated) {
      navigate("/app");
    }
  }, [authenticated, navigate]);

  const handleLogin = () => {
    keycloak.login();
  };


  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '60vh'
    }}>
      <h2>Welcome to Todo App</h2>
      <p>Please login to continue</p>
      <button onClick={handleLogin}>Login with Keycloak</button>
    </div>
  );
}