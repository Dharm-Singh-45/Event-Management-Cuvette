import React from "react";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? <Navigate to="/dashboard/events" replace /> : children;
};

export default GuestRoute;
