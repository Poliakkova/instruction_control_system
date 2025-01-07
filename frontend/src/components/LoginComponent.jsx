import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { Alert } from 'react-bootstrap'

import LoginService from '../sevices/LoginService'
// import { useAuth } from '../AuthContext';

import '../css/Login.css'

const LoginComponent = () => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // const { login } = useAuth(); // Отримуємо функцію login з контексту

    function togglePassword (e) {
        const input = document.querySelector('#password');
        e.preventDefault();
    
        if (input.type === 'password') {
            input.type = 'text';
            e.target.textContent = 'visibility_off';
        } else {
            input.type = 'password';
            e.target.textContent = 'visibility';
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("DATA: " + login + " " + password);

        try {
            const userData = await LoginService.login(login, password);
            console.log("userData: " + userData.token);

            // Використовуємо функцію login з контексту для оновлення стану
            // login(userData);

            if(userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('jobTitle', userData.jobTitle);
                localStorage.setItem('surname', userData.surname);
                localStorage.setItem('name', userData.name);
                localStorage.setItem('patronymic', userData.patronymic);
                localStorage.setItem('email', userData.email);
                localStorage.setItem('login', userData.login);
                localStorage.setItem('enableNotification', userData.enableNotification);
                localStorage.setItem('password', userData.password);

                navigate("/instructions");
                window.location.reload(); 
            } else {
                if (userData.message === "Bad credentials") setError("Неправильний пароль");
                else if (userData.message === "No value present") setError("Користувача не знайдено");
                else setError(userData.message);
            }

        }catch(error) {
            console.log(error.message);
            setError(error.message);
        }
    }

    return (
        <div className="page">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>

            <div className="login-section">
                <h1>Керування дорученнями</h1>
                <h3>Здійснюйте облік доручень на кафедрі онлайн </h3>
                <p>З поверненням! Будь ласка, увійдіть до акаунта</p>
                <p style={{marginBottom: 20}}>Якщо не маєте даних для авторизації зверніться до адміністрації 🙂</p>

                {error && <Alert key="danger" variant="danger" style={{
                    marginBottom: 0,
                    padding: "6px 12px",
                    fontSize: 14
                }}><i className="bi bi-exclamation-diamond" style={{marginRight: 5}}></i>Помилка: {error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <label className='login-label'>Логін
                        <input className="login" type="login" id="login" name="login" required
                        value={login}
                        onChange={(event) => {
                            setLogin(event.target.value)
                        }}/>
                    </label>
                    
                    <label className='password-label'>Пароль
                        <input className="password" type="password" id="password" name="password" required
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value)
                        }}/>
                        <button className="material-symbols-outlined pass-button"  onClick={togglePassword}>visibility</button>
                    </label>
                    
                    <div className="forgot-remember">
                        <a href="/forgot-password" className="forgot-password">Забули пароль?</a>
                    </div>
                    
                    <button className='login-button' type="submit">Увійти</button>
                </form>
            </div>
            <div className="image-section">
                <div className="logo">
                    <img src="../nniate_logo.png" alt="Logo"/>
                    <span>Система обліку доручень НН ІАТЕ</span>
                </div>
                <img className='login-pic' src="../login_pic.png" alt="Picture"/>
            </div>
        </div>
  )
}

export default LoginComponent