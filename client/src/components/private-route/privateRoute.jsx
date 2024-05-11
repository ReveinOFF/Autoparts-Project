import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { isAuth } = useSelector((s) => s.auth);
  const accessToken = localStorage.getItem("token");

  return isAuth || accessToken ? children : <Navigate to="/" replace />;
};

export const BlockRoute = ({ children }) => {
  const { isAuth } = useSelector((s) => s.auth);
  const accessToken = localStorage.getItem("token");

  return isAuth || accessToken ? <Navigate to="/" replace /> : children;
};
