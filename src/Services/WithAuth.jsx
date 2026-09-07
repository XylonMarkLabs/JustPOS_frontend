import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService.jsx";

// HOC to wrap component and verify authentication
export default function withAuth(AuthComponent) {
  return function AuthWrapped(props) {
    const [confirm, setConfirm] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const Auth = AuthService;
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        if (!Auth.loggedIn()) {
          navigate("/");
        } else {
          try {
            const confirmData = await Auth.getConfirm();
            setConfirm(confirmData);
            setLoaded(true);
          } catch (err) {
            console.error(err);
            Auth.logout();
            navigate("/");
          }
        }
      };

      checkAuth();
    }, [Auth, navigate]);

    if (loaded) {
      if (confirm) {
        return (
          <AuthComponent
            {...props}
            confirm={confirm}
          />
        );
      } else {
        console.log("not confirmed!");
        return null;
      }
    }

    return null;
  };
}
