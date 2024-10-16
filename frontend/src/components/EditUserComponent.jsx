import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import { updateUser } from '../sevices/UserService'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/AddUser.css'

const EditUserComponent = () => {

  const navigator = useNavigate();

  function navigateCreateUser(){
    navigator('/users/new')
  }

  const [user, setUser] = useState({
    userJobTitle: '',
    userSurname: '',
    userName: '',
    userPatronymic: '',
    userEmail: '',
    userLogin: 'Smirnov.F'
  });

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
        <div className="form-floating mb-3 mt-3">
          <select className="form-select" id="userJobTitle" name="userJobTitle" aria-label="Choose role"
          defaultValue=""
          value={user.userJobTitle}
          onChange={handleChange}>
            <option value="">Оберіть роль користувача</option>
            <option value="Адмін">Адмін</option>
            <option value="Студ.представник">Студ.представник</option>
            <option value="Викладач">Викладач</option>
          </select>
          <label htmlFor="userJobTitle">Оберіть роль користувача</label>
        </div>

        <div className="form-floating">
          <input type="text" className="form-control" id="userSurname" name="userSurname" placeholder="Прізвище"
          value={user.userSurname}
          onChange={handleChange}/>
          <label htmlFor="userSurname">Прізвище</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" id="userName" name="userName" placeholder="Ім'я"
          value={user.userName}
          onChange={handleChange}/>
          <label htmlFor="userName">Ім'я</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" id="userPatronymic" name="userPatronymic" placeholder="По-батькові"
          value={user.userPatronymic}
          onChange={handleChange}/>
          <label htmlFor="userPatronymic">По-батькові</label>
        </div>

        <div className="form-floating mt-3">
          <input type="email" className="form-control" id="userEmail" name="userEmail" placeholder="Пошта"
          value={user.userEmail}
          onChange={handleChange}/>
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