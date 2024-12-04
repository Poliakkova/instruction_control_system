import React, { createContext, useContext, useState, useEffect } from 'react';
import LoginService from './sevices/LoginService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        console.log('AuthProvider useEffect triggered');

        const token = localStorage.getItem('token');
        if (token) {
            const userData = {
              token: token,
              jobTitle: localStorage.getItem('jobTitle'),
              surname: localStorage.getItem('surname'),
              name: localStorage.getItem('name'),
              patronymic: localStorage.getItem('patronymic'),
              email: localStorage.getItem('email'),
              login: localStorage.getItem('login'),
              enableNotification: localStorage.getItem('enableNotification') === 'true',
            };
            console.log('User initialized:', userData);
            setUser({ ...userData });
            setIsAuthenticated(true);
        } else {
        console.log('No token found in localStorage');
        }
        // if (token) {
        //   // Отримуємо інформацію про користувача, якщо токен є
        //   LoginService.getProfile(token)
        //     .then((profile) => {
        //       setUser(profile); // Зберігаємо інформацію про користувача
        //       console.log("PROFILE: " + profile);
        //       setIsAuthenticated(true);
        //     })
        //     .catch((error) => {
        //       console.error('Error fetching profile:', error);
        //       setIsAuthenticated(false);
        //     });
        // }
    }, []);
    
    const login = (userData) => {
        console.log('Logging in user:', userData);
        setUser({ ...userData });
        setIsAuthenticated(true);
    };

    const logout = () => {
        console.log('Logging out user');
        LoginService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
