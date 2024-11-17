import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import SideBarUserComponent from '../panels/SideBarUserComponent';
import { deleteUser, getUserByLogin } from '../../sevices/UserService';
import { deleteInstruction } from '../../sevices/InstructionService';
import { statusMapping, getStatusClass, statusMappingRoles } from '../instructions/js/statusUtils';
import InstructionTableComponent from '../instructions/InstructionTableComponent';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/AddUser.css';

const UserComponent = () => {

  const navigator = useNavigate();

  const navigateEditUser = (userLogin) => {
      navigator(`/users/edit/${encodeURIComponent(userLogin)}`);
  };

  const handleRowClick = (code) => {
    navigator(`/instructions/${encodeURIComponent(code)}`);
  };

  const editInstruction = (code) => {
    navigator(`/instructions/edit/${encodeURIComponent(code)}`);
  };

  const { userLogin } = useParams(); // Отримуємо параметр з URL

  const [user, setUser] = useState({
    userJobTitle: '',
    userSurname: '',
    userName: '',
    userPatronymic: '',
    userEmail: '',
    userLogin: userLogin,
    instructions: []
  });

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

  return (
    <div className='wrapper'>
      <SideBarUserComponent />

    <div className="main-content" style={{width: '100%', overflowX: 'auto'}}>
      <h2 className='text-center mb-3 text-bold'>Сторінка користувача</h2>

      <div className="content">
        <a title="Редагувати" onClick={() => {navigateEditUser(user.userLogin)}}><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></a>
        <a title="Видалити" onClick={() => {deleteUser(user.userLogin, navigator, localStorage.getItem("token"))}}><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></a>

        <div className='user-title'>{user.userSurname} {user.userName} {user.userPatronymic}</div>
        <div>Роль: {statusMappingRoles[user.userJobTitle] || 'Невідомий статус'}</div>
        <div>Логін: {user.userLogin}</div>
        <div style={{display:'flex'}}>
          <div style={{marginRight: 10}}>Пошта: {user.userEmail} </div>
          <span>{user.enableNotification ? (
              <i title="Сповіщення увімкнено" className="bi bi-bell-fill" style={{ color: 'green' }}></i> // іконка для увімкнених сповіщень
          ) : (
              <i title="Сповіщення вимкнено" className="bi bi-bell-slash-fill" style={{ color: 'red' }}></i> // іконка для вимкнених сповіщень
          )}</span>
        </div>

          <h4>Доручення</h4>
          <InstructionTableComponent
            filteredInstructions={user.instructions}
            handleRowClick={handleRowClick}
            editInstruction={editInstruction}
            deleteInstruction={deleteInstruction}
            statusMapping={statusMapping}
            getStatusClass={getStatusClass}
            navigator={navigator}
          />
    </div>
    </div>
    </div>
  )
}

export default UserComponent