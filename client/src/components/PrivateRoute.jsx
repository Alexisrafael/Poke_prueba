import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);
  console.log("Estado completo:", useSelector((state) => state));
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
