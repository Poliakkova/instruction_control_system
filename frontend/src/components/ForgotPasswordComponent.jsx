import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import axios from 'axios';

import LoginService from '../sevices/LoginService'
import { useAuth } from '../AuthContext';

import '../css/Login.css'

const ForgotPasswordComponent = () => {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
        const response = await axios.post('http://localhost:8090/auth/forgot-password', null, {
            params: { email },
        });
        setError(response.data);
        } catch (error) {
        setError(error.response?.data || 'Сталася помилка');
        }
    }

    return (
        <div className="page">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>

            <div className="login-section">
                <h1>Керування дорученнями</h1>
                <h3>Відновлення паролю </h3>
                <p style={{marginBottom: 20}}>Будь ласка, введіть Вашу електронну адресу</p>

                {error && <Alert key="danger" variant="primary" style={{
                    marginBottom: 0,
                    padding: "6px 12px",
                    fontSize: 14
                }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <label className='login-label'>Електронна адреса
                        <input className="login" type="email" id="email" name="email" required
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value)
                        }}/>
                    </label>
                    
                    <button className='login-button' type="submit">Отримати інструкцію по відновленню</button>
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

export default ForgotPasswordComponent