import axios from 'axios';

class LoginService {

    static getUserData() {
        return {
          token: localStorage.getItem('token'),
          jobTitle: localStorage.getItem('jobTitle'),
          surname: localStorage.getItem('surname'),
          name: localStorage.getItem('name'),
          patronymic: localStorage.getItem('patronymic'),
          email: localStorage.getItem('email'),
          login: localStorage.getItem('login'),
          enableNotification: localStorage.getItem('enableNotification') === 'true',
        };
    }

    static async login (login, password) {
        try {
            const response = await axios.post(`http://localhost:8090/auth/login/`, {login,password});
            console.log("response: " + response.data.login)
            return response.data;
        } catch(err)  {
            throw err;
        }
    }

    static async getProfile (token) {
        try {
            const response = await axios.get(`http://localhost:8090/users/get-profile`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            return response.data;
        } catch(err)  {
            throw err;
        }
    }

    static async logout() {
        // localStorage.removeItem('token');
        // localStorage.removeItem('jobTitle');
        localStorage.clear();
    }

    static isAuthenticated () {
        const token = localStorage.getItem('token');
        console.log("isAuthenticated: " + !!token + " " + token);
        return !!token;
    }

    static isAdmin ()  {
        const role = localStorage.getItem('jobTitle');
        console.log("isAdmin: "+ (role === "ADMIN") + " " + role);
        return role === "ADMIN";
    }

    static isTeacher ()  {
        const role = localStorage.getItem('jobTitle');
        return role === "TEACHER";
    }

    static isStudent ()  {
        const role = localStorage.getItem('jobTitle');
        return role === "STUDENT";
    }

    static adminOnly ()  {
        return this.isAuthenticated() && this.isAdmin();
    }

    static isNotification () {
        const enabled = localStorage.getItem('enableNotification')
        console.log(enabled);
        return enabled === "true";
    }
}

export default LoginService;