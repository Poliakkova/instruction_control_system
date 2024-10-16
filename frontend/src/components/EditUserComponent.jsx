import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import { updateUser, getUserByLogin } from '../sevices/UserService'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/AddUser.css'

const EditUserComponent = () => {

  const navigator = useNavigate();

  function navigateCreateUser(){
    navigator('/users/new')
  }

  const { userLogin } = useParams(); // Отримуємо параметр з URL

  const [user, setUser] = useState({
    userJobTitle: '',
    userSurname: '',
    userName: '',
    userPatronymic: '',
    userEmail: '',
    userLogin: userLogin
  });

  useEffect(() => {
    // Викликаємо функцію для отримання користувача за логіном
    const fetchUser = async () => {
      try {
        const userData = await getUserByLogin(userLogin);
        console.log('Дані користувача:', userData); 
        setUser(userData); // Оновлюємо стан з даними користувача
      } catch (error) {
        console.error('Error fetching instruction:', error);
      }
    };

    if (userLogin) {
      fetchUser(); // Викликаємо функцію тільки якщо є логін
    }
  }, [userLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit - user " + user);
    updateUser(user, navigator);
  };


  return (
    <div className='wrapper'>
      <div className="sidebar">
        <button onClick={() => navigateCreateUser()}>Додати користувача</button>
      </div>

    <div className="main-content">
      <h2 className='text-center mb-3 text-bold'>Редагуйте користувача</h2>

      <div className="content">
      <form onSubmit={handleSubmit}>
        <div style={{margin: 10, fontWeight: 600}}>Логін користувача: {user.userLogin}</div>
        <div className="form-floating mb-3 mt-3">
          <select className="form-select" id="userJobTitle" name="userJobTitle" aria-label="Choose role"
          defaultValue=""
          value={user.userJobTitle}
          onChange={handleChange}>
            <option value="">Оберіть роль користувача</option>
            <option value="ADMIN">Адмін</option>
            <option value="STUDENT">Студ.представник</option>
            <option value="TEACHER">Викладач</option>
          </select>
          <label htmlFor="userJobTitle">Оберіть роль користувача</label>
        </div>

        <div className="form-floating">
          <input type="text" className="form-control" id="userSurname" name="userSurname" placeholder="Прізвище"
          value={user.userSurname}
          onChange={handleChange} maxLength={255}/>
          <label htmlFor="userSurname">Прізвище</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" id="userName" name="userName" placeholder="Ім'я"
          value={user.userName}
          onChange={handleChange} maxLength={255}/>
          <label htmlFor="userName">Ім'я</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" id="userPatronymic" name="userPatronymic" placeholder="По-батькові"
          value={user.userPatronymic}
          onChange={handleChange} maxLength={255}/>
          <label htmlFor="userPatronymic">По-батькові</label>
        </div>

        <div className="form-floating mt-3">
          <input type="email" className="form-control" id="userEmail" name="userEmail" placeholder="Пошта"
          value={user.userEmail}
          onChange={handleChange} maxLength={255}/>
          <label htmlFor="userEmail">Пошта</label>
        </div>

        <button type='submit' className='add-user-button mt-3 mb-3'>Редагувати користувача</button>
      </form>
    </div>
    </div>
    </div>
  )
}

export default EditUserComponent