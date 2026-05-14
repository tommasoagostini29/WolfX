import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth(); /* verifico se è loggato o no e in caso lo buttofuori alla pagina di login */

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;