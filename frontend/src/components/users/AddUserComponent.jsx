import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import { addUser } from '../../sevices/UserService'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../../css/AddUser.css'
import SideBarUserComponent from '../panels/SideBarUserComponent'

const AddUserComponent = () => {

  const navigator = useNavigate();

  const [user, setUser] = useState({
    userJobTitle: '',
    userSurname: '',
    userName: '',
    userPatronymic: '',
    userEmail: '',
    userLogin: '',
    userPassword: "1",
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
      await addUser(user, navigator, localStorage.getItem("token")); // Викликаємо функцію додавання користувача
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className='wrapper'>
      <SideBarUserComponent />

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
          <label htmlFor="userJobTitle">Оберіть роль користувача</label>
        </div>

        <div className="form-floating">
          <input required type="text" className="form-control" id="userSurname" placeholder="Прізвище"  onChange={handleChange}/>
          <label htmlFor="surname">Прізвище</label>
        </div>
        <div className="form-floating">
          <input required type="text" className="form-control" id="userName" placeholder="Ім'я" onChange={handleChange}/>
          <label htmlFor="name">Ім'я</label>
        </div>
        <div className="form-floating">
          <input required type="text" className="form-control" id="userPatronymic" placeholder="По-батькові" onChange={handleChange}/>
          <label htmlFor="patronymic">По-батькові</label>
        </div>

        <div className="form-floating mt-3">
          <input required type="text" className="form-control" id="userLogin" placeholder="Логін (у форматі Прізвище і Ініціал англійською - Ivanov.I)" onChange={handleChange}/>
          <label htmlFor="userLogin">Логін (у форматі Прізвище і Ініціал латиницею ("Ivanov.I"). Унікальний, зміні не підлягатиме!)</label>
        </div>

        <div className="form-floating mt-3">
          <input required type="email" className="form-control" id="userEmail" placeholder="Пошта" onChange={handleChange}/>
          <label htmlFor="userEmail">Пошта</label>
        </div>

        <div className="form-floating">
          <input required type="text" className="form-control" id="userPassword" placeholder="Пароль" onChange={handleChange}
          defaultValue={"1"}/>
          <label htmlFor="userPassword">Пароль</label>
        </div>

        <button type="submit" className='add-user-button mt-3 mb-3'>Додати користувача</button>
      </form>
    </div>
    </div>
    </div>
  )
}

export default AddUserComponent