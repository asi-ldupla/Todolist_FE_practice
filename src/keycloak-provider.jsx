import React, { createContext, useState, useEffect, useContext } from "react";
import Keycloak from "keycloak-js";

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/v1";

export const KeycloakContext = createContext();

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  const exchangeTokenForCookie = async (token) => {
    console.log('Exchange token for cookie called');
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keycloakToken: token }),
        credentials: 'include',
      });

      console.log('Session response status:', response.status);

      if (response.ok) {
        setError(null);
        console.log('Session cookie created successfully');
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create session');
        return false;
      }
    } catch (error) {
      setError(error.message);
      console.error('Error exchanging token:', error);
      return false;
    }
  };

  useEffect(() => {
    const kc = new Keycloak({
      url: KEYCLOAK_URL,
      realm: "MyRealm",
      clientId: "todolist-app",
    });

    let refreshInterval;

    kc.init({ 
      onLoad: "login-required",
      checkLoginIframe: false
    })
      .then(async (auth) => {
        console.log('Keycloak initialized, auth:', auth);
        setKeycloak(kc);
        setAuthenticated(auth);
        
        if (auth) {
          console.log('User authenticated, creating session...');
          const success = await exchangeTokenForCookie(kc.token);
          console.log('Session creation result:', success);
          
          // Start token refresh interval regardless of session creation success
          refreshInterval = setInterval(() => {
            if (kc && kc.authenticated) {
              kc.updateToken(70)
                .then((refreshed) => {
                  if (refreshed) {
                    console.log("Token refreshed in Keycloak");
                    exchangeTokenForCookie(kc.token);
                  }
                })
                .catch(() => console.error("Failed to refresh token"));
            }
          }, 60000);
        } else {
          console.log('User not authenticated');
        }
      })
      .catch((err) => {
        console.error('Keycloak initialization error:', err);
        setError('Failed to initialize authentication');
      });

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      if (keycloak) {
        keycloak.logout({ redirectUri: window.location.origin });
      }
    }
  };

  // Show error state
  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!keycloak) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  }

  console.log('Rendering app, authenticated:', authenticated);
  
  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, logout }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useKeycloak must be used within KeycloakProvider');
  }
  return context;
};