import { Routes, Route } from "react-router-dom";
import App from './App.jsx';
import LoginPage from "./login-page.jsx";
import Navbar from "./components/navbar.jsx";
import PrivateRoute from "./components/private-route.jsx";

export default function MainPage() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* doesn't really use login page, it will just automatically redirect to /app route */}
        {/* since login page is already provided by keycloak */}
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/app" element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        } />
        
        <Route path="*" element={
          <PrivateRoute>
            <h1>404 Not Found</h1>
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}