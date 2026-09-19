import axios from "axios";
import { baseURL } from "./ApiCall";

const AuthService = {
  getBusinessData: () => {
    const data = localStorage.getItem("businessData");
    return data ? JSON.parse(data) : null;
  },

  isBusinessLoggedIn: () => {
    return !!localStorage.getItem("businessData");
  },

  getBusinessId: () => {
    const businessData = localStorage.getItem("businessData");
    return businessData ? JSON.parse(businessData).id : null;
  },

  getConfirm: () => {
    throw new Error(
      "AuthService.getConfirm() is deprecated — the token is httpOnly and can't be decoded client-side. Use ApiCall.user.getUserData() (/user/me) instead."
    );
  },

  isTokenExpired: () => {
    console.warn(
      "AuthService.isTokenExpired() is deprecated and can no longer check anything meaningful — use AuthContext's isAuthenticated instead."
    );
    return true;
  },

  loggedIn: () => {
    console.warn(
      "AuthService.loggedIn() is deprecated — use AuthContext's isAuthenticated instead."
    );
    return false;
  },

  logout: async () => {
    try {
      await axios.post(`${baseURL}/user/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Error clearing session on server:", error);
    }

    localStorage.removeItem("user");
    window.location.href = "/";
  },
};

export default AuthService;