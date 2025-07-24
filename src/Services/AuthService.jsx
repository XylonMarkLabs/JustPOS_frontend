import { jwtDecode } from "jwt-decode";

const AuthService = {
  getToken: () => {
    return localStorage.getItem("token");
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
        window.location.href = "/login";
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
    window.location.href = "/login";
  },
};

export default AuthService;
