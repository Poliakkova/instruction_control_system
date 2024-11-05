import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import { addUser } from '../sevices/UserService'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/AddUser.css'

const AddUserComponent = () => {

  const navigator = useNavigate();

  function navigateCreateUser(){
    navigator('/users/new');
  }

  const [user, setUser] = useState({
    userJobTitle: '',
    userSurname: '',
    userName: '',
    userPatronymic: '',
    userEmail: '',
    userLogin: '',
    enableNotification: true
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log("ID, VALUE " + id + " " + value);
    setUser(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Запобігає перезавантаженню сторінки

    try {
      await addUser(user, navigator); // Викликаємо функцію додавання користувача
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className='wrapper'>
      <div className="sidebar">
        <button onClick={() => navigateCreateUser()}>Додати користувача</button>
      </div>

    <div className="main-content">
      <h2 className='text-center mb-3 text-bold'>Додайте користувача</h2>

      <div className="content">
      <form  onSubmit={handleSubmit}>
        <div className="form-floating mb-3 mt-3">
          <select required className="form-select" id="userJobTitle" aria-label="Choose role"  onChange={handleChange}>
            <option selected>Оберіть роль користувача</option>
            <option value="STUDENT">Студ.представник</option>
            <option value="TEACHER">Викладач</option>
            <option value="ADMIN">Адмін</option>
          </select>
          <label for="userJobTitle">Оберіть роль користувача</label>
        </div>

        <div className="form-floating">
          <input required type="text" className="form-control" id="userSurname" placeholder="Прізвище"  onChange={handleChange}/>
          <label for="surname">Прізвище</label>
        </div>
        <div className="form-floating">
          <input required type="text" className="form-control" id="userName" placeholder="Ім'я" onChange={handleChange}/>
          <label for="name">Ім'я</label>
        </div>
        <div className="form-floating">
          <input required type="text" className="form-control" id="userPatronymic" placeholder="По-батькові" onChange={handleChange}/>
          <label for="patronymic">По-батькові</label>
        </div>

        <div className="form-floating mt-3">
          <input required type="text" className="form-control" id="userLogin" placeholder="Логін (у форматі Прізвище і Ініціал англійською - Ivanov.I)" onChange={handleChange}/>
          <label for="userLogin">Логін (у форматі Прізвище і Ініціал англійською - Ivanov.I)</label>
        </div>

        <div className="form-floating mt-3">
          <input required type="email" className="form-control" id="userEmail" placeholder="Пошта" onChange={handleChange}/>
          <label for="userEmail">Пошта</label>
        </div>

        <button type="submit" className='add-user-button mt-3 mb-3'>Додати користувача</button>
      </form>
    </div>
    </div>
    </div>
  )
}

export default AddUserComponent