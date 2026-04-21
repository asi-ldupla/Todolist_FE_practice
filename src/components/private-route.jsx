import { Navigate } from "react-router-dom";
import { useKeycloak } from "../keycloak-provider";

export default function PrivateRoute({ children }) {
  const { authenticated } = useKeycloak();
  
  console.log('PrivateRoute - authenticated:', authenticated);
  
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}