import { jwtDecode } from "jwt-decode"

const AuthService = {
    getToken: () => {
        return localStorage.getItem('token');
    },

    getConfirm: () => {
        let answer = jwtDecode(AuthService.getToken());
        return answer;
    }
}

export default AuthService;