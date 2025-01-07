import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import { updateUser, getUserByLogin, changePassword } from '../../sevices/UserService'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../../css/AddUser.css'
import { statusMappingRoles } from '../instructions/js/statusUtils'
import SideBarInstructionComponent from '../panels/SideBarInstructionComponent'

const SettingsComponent = () => {

  const navigator = useNavigate();

  const { userLogin } = useParams(); // Отримуємо параметр з URL

  const [user, setUser] = useState({
    userJobTitle: '',
    userSurname: '',
    userName: '',
    userPatronymic: '',
    userEmail: '',
    userPassword: '',
    userLogin: userLogin,
    notifyWeekReport: true,
    notifyMissedDeadline: true,
    notifyNewInstruction: true,
    notifyStatusChange: true,
    notifyNewComment: true
  });

  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')

  useEffect(() => {
    // Викликаємо функцію для отримання користувача за логіном
    const fetchUser = async () => {
      try {
        const userData = await getUserByLogin(userLogin, localStorage.getItem("token"));
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

  const handleOldPassChange = (e) => setOldPass(e.target.value);
  const handleNewPassChange = (e) => setNewPass(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit - user " + user);
    if (updateUser(user, navigator, localStorage.getItem("token"))) {
      alert('Користувач успішно оновлений');
    } else {
      alert('Помилка при оновленні користувача. Перевірте дані');
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    console.log("---USER PASS: " + user.userPassword);

    if (oldPass.trim() !== '' && newPass.trim() !== '') {
      try {
        await changePassword(user.userLogin, oldPass, newPass, localStorage.getItem('token'));
        setOldPass('');
        setNewPass('');
      } catch (error) {
        console.error('Помилка під час зміни пароля:', error);
      }
    } else if (oldPass.trim() !== '' || newPass.trim() !== '') {
      alert('Будь ласка, заповніть обидва поля для зміни пароля.');
      return;
    }
  };

  const handleToggleMissedDeadline = async () => {
    setUser({
      ...user,
      notifyMissedDeadline: !user.notifyMissedDeadline
    }); 
  };

  const handleToggleNewInstruction = async () => {
    setUser({
      ...user,
      notifyNewInstruction: !user.notifyNewInstruction
    }); 
  };

  const handleToggleStatusChange = async () => {
    setUser({
      ...user,
      notifyStatusChange: !user.notifyStatusChange
    }); 
  };

  const handleToggleNewComment = async () => {
    setUser({
      ...user,
      notifyNewComment: !user.notifyNewComment
    }); 
  };

  const handleToggleWeekReport = async () => {
    setUser({
      ...user,
      notifyWeekReport: !user.notifyWeekReport
    }); 
  };


  return (
    <div className='wrapper'>
      <SideBarInstructionComponent />

    <div className="main-content">
      <h2 className='text-center mb-3 text-bold'>Налаштування профілю</h2>

      <div className="content">
      <form onSubmit={handleSubmit}>
        <div style={{margin: 10, fontWeight: 600}}>Мій логін: {user.userLogin} (зміні не підлягає)</div>
        <div style={{margin: 10}}>Моя роль: {statusMappingRoles[user.userJobTitle] || 'Невідомий статус'} (для зміни зверніться до адміністратора)</div>

        <div className="form-floating">
          <input required type="text" className="form-control" id="userSurname" name="userSurname" placeholder="Прізвище"
          value={user.userSurname}
          onChange={handleChange} maxLength={255}/>
          <label htmlFor="userSurname">Прізвище</label>
        </div>
        <div className="form-floating">
          <input required type="text" className="form-control" id="userName" name="userName" placeholder="Ім'я"
          value={user.userName}
          onChange={handleChange} maxLength={255}/>
          <label htmlFor="userName">Ім'я</label>
        </div>
        <div className="form-floating">
          <input required type="text" className="form-control" id="userPatronymic" name="userPatronymic" placeholder="По-батькові"
          value={user.userPatronymic}
          onChange={handleChange} maxLength={255}/>
          <label htmlFor="userPatronymic">По-батькові</label>
        </div>

        <div className="form-floating mt-3">
          <input required type="email" className="form-control" id="userEmail" name="userEmail" placeholder="Пошта"
          value={user.userEmail}
          onChange={handleChange} maxLength={255}/>
          <label htmlFor="userEmail">Пошта</label>
        </div>

        <div className="" style={{margin: 10}}>
          Отримувати щотижневий звіт з дорученнями на тиждень: 
          {user.notifyWeekReport ? <span title="Cповіщення увімкнено" onClick={handleToggleWeekReport} value={true}> 
            <i className="bi bi-bell-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>
          : <span title="Cповіщення вимкнено" onClick={handleToggleWeekReport} value={false}> 
            <i className="bi bi-bell-slash-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>}
        </div>

        <div className="" style={{margin: 10}}>
          Сповіщати про наближення кінцевого терміну за 7, 3 і 1 день: 
          {user.notifyMissedDeadline ? <span title="Cповіщення увімкнено" onClick={handleToggleMissedDeadline} value={true}> 
            <i className="bi bi-bell-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>
          : <span title="Cповіщення вимкнено" onClick={handleToggleMissedDeadline} value={false}> 
            <i className="bi bi-bell-slash-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>}
        </div>

        <div className="" style={{margin: 10}}>
          Сповіщати про нове доручення: 
          {user.notifyNewInstruction ? <span title="Cповіщення увімкнено" onClick={handleToggleNewInstruction} value={true}> 
            <i className="bi bi-bell-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>
          : <span title="Cповіщення вимкнено" onClick={handleToggleNewInstruction} value={false}> 
            <i className="bi bi-bell-slash-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>}
        </div>

        <div className="" style={{margin: 10}}>
          Сповіщати про зміну статуса доручення: 
          {user.notifyStatusChange ? <span title="Cповіщення увімкнено" onClick={handleToggleStatusChange} value={true}> 
            <i className="bi bi-bell-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>
          : <span title="Cповіщення вимкнено" onClick={handleToggleStatusChange} value={false}> 
            <i className="bi bi-bell-slash-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>}
        </div>

        <div className="" style={{margin: 10}}>
          Сповіщати про нові коментарі: 
          {user.notifyNewComment ? <span title="Cповіщення увімкнено" onClick={handleToggleNewComment} value={true}> 
            <i className="bi bi-bell-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>
          : <span title="Cповіщення вимкнено" onClick={handleToggleNewComment} value={false}> 
            <i className="bi bi-bell-slash-fill" style={{ fontSize: '18px', cursor: 'pointer', marginLeft: 10}}></i></span>}
        </div>

        <button type='submit' className='add-user-button mt-3 mb-3'>Зберегти зміни</button>
      </form>

      <form onSubmit={handleSubmitPassword}>
        <hr style={{margin: '20px 0 50px'}}></hr>
        <div className="" style={{margin: 10, fontWeight: 600}}>Змінити пароль</div>

        <div className="form-floating mt-3">
          <input type="text" className="form-control" id="oldPass" name="oldPass" placeholder="Старий пароль"
          onChange={handleOldPassChange} maxLength={255}/>
          <label htmlFor="oldPass">Старий пароль</label>
        </div>

        <div className="form-floating mt-3">
          <input type="text" className="form-control" id="newPass" name="newPass" placeholder="Новий пароль"
          onChange={handleNewPassChange} maxLength={255}/>
          <label htmlFor="newPass">Новий пароль</label>
        </div>

        <button type='submit' className='add-user-button mt-3 mb-3'>Оновити пароль</button>

      </form>
    </div>
    </div>
    </div>
  )
}

export default SettingsComponent