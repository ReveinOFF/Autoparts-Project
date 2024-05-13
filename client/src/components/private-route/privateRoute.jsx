import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { isAuth } = useSelector((s) => s.auth);
  const accessToken = localStorage.getItem("token");

  return isAuth || accessToken ? children : <Navigate to="/login" replace />;
};

export const BlockRoute = ({ children }) => {
  const { isAuth } = useSelector((s) => s.auth);
  const accessToken = localStorage.getItem("token");

  return isAuth || accessToken ? <Navigate to="/" replace /> : children;
};

export const PrivateAdminRoute = ({ children }) => {
  const { isAuth } = useSelector((s) => s.auth);
  const accessToken = localStorage.getItem("token");

  if (!accessToken || !isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  const { role } = jwtDecode(accessToken);

  return role === "admin" ? children : <Navigate to="/admin/login" replace />;
};

export const BlockAdminRoute = ({ children }) => {
  const { isAuth } = useSelector((s) => s.auth);
  const accessToken = localStorage.getItem("token");

  if (!accessToken || !isAuth) {
    return <>{children}</>;
  }

  const { role } = jwtDecode(accessToken);

  return role === "admin" ? (
    <Navigate to="/admin/edit" replace />
  ) : (
    <>{children}</>
  );
};
