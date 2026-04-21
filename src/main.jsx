import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MainPage from "./main-page.jsx";
import { KeycloakProvider } from "./keycloak-provider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <KeycloakProvider>
      <MainPage />
    </KeycloakProvider>
  </BrowserRouter>
);