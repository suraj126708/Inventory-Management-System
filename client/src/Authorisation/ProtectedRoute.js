import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthProvider";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const userRole = localStorage.getItem("role");
  console.log(userRole);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  console.log(allowedRoles[0]);

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
