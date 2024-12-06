import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  // If there's no user, redirect to home
  if (!user) {
    return <Navigate to='/home' replace />;
  }

  // If user's role is not in the allowed roles, redirect to home
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to='/home' replace />;
  }

  // If user has permission, render the protected component
  return children;
};

export default RoleBasedRoute;
