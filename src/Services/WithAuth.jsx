import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";

export default function withAuth(AuthComponent, allowedRoles = null) {
  return function AuthWrapped(props) {
    const { isAuthenticated, authLoading, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const hasRequiredRole = !allowedRoles || (user && allowedRoles.includes(user.role));

    useEffect(() => {
      if (authLoading) return;

      if (!isAuthenticated) {
        navigate("/", { replace: true });
        return;
      }

      if (!hasRequiredRole) {
        navigate("/home", { replace: true });
      }
    }, [authLoading, isAuthenticated, hasRequiredRole, navigate]);

    if (authLoading || !isAuthenticated || !hasRequiredRole) {
      return null;
    }

    return <AuthComponent {...props} confirm={user} />;
  };
}