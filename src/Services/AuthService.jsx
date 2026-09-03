import { jwtDecode } from "jwt-decode";

const AuthService = {
  getToken: () => {
    return localStorage.getItem("token");
  },

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

  getBusinessData: () => {
    const data = localStorage.getItem("businessData");
    return data ? JSON.parse(data) : null;
  },

  getConfirm: () => {
    let answer = jwtDecode(AuthService.getToken());
    return answer;
  },

  isTokenExpired: () => {
    try {
      const token = AuthService.getToken();
      if (!token) return true;

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return true;
      } else return false;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  },

  loggedIn: () => {
    const token = AuthService.getToken();
    return !!token && !AuthService.isTokenExpired();
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // localStorage.removeItem("businessId");
    // localStorage.removeItem("businessData");
    window.location.href = "/user-login";
  },
};

export default AuthService;
