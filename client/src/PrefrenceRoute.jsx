import React from "react";
import { Navigate } from "react-router-dom";
import { useGetUserDetailsQuery } from "./redux/userApi";

const PreferenceRoute = ({ children }) => {
  const { data: user, isLoading } = useGetUserDetailsQuery();

  if (isLoading) return <p>Loading...</p>;


  if (user?.username) return <Navigate to="/dashboard/events" replace />;

  return children; 
};

export default PreferenceRoute;
