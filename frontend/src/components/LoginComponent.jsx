import React from 'react'
import '../css/Login.css'

const LoginComponent = () => {

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

    return (
        <div className="page">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>

            <div className="login-section">
                <h1>Керування дорученнями</h1>
                <h3>Здійснюйте облік доручень на кафедрі онлайн </h3>
                <p>З поверненням! Будь ласка, увійдіть до акаунта</p>
                <p>Якщо не маєте даних для авторизації зверніться до адміністрації 🙂</p>
                <form>
                    <label className='email-label'>Електронна адреса
                        <input className="email" type="email" id="email" name="email" required/>
                    </label>
                    
                    <label className='password-label'>Пароль
                        <input className="password" type="password" id="password" name="password" required/>
                        <button className="material-symbols-outlined pass-button"  onClick={togglePassword}>visibility</button>
                    </label>
                    
                    <div className="forgot-remember">
                        <div className="remember-me">
                            <input type="checkbox" id="remember-me" name="remember-me"/>
                            <label for="remember-me">Запам'ятати мене</label>
                        </div>
                        <a href="#" className="forgot-password">Забули пароль?</a>
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