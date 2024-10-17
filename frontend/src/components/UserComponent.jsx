import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import Table from 'react-bootstrap/Table';

import { updateUser, getUserByLogin } from '../sevices/UserService'
import { deleteInstruction } from '../sevices/InstructionService'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/AddUser.css'

const UserComponent = () => {

  const navigator = useNavigate();

  function navigateCreateUser(){
    navigator('/users/new')
  }

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

  const statusMapping = {
    CREATED: 'Назначено',
    CONFIRMATION: 'Очікує затвердження',
    IN_PROGRESS: 'В роботі',
    CANCELLED: 'Скасовано',
    FINISHED: 'Виконано',
  };

  const statusMappingRoles = {
    ADMIN: 'Адмін',
    TEACHER: 'Викладач',
    STUDENT: 'Студ.представник'
};

  // Функція для визначення класу на основі статусу
  const getStatusClass = (status) => {
    switch (status) {
    case 'Назначено':
        return 'status orange';
    case 'В роботі':
        return 'status yellow';
    case 'Очікує затвердження':
        return 'status green';
    case 'Виконано':
        return 'status grey';
    default:
        return 'status grey';
    }
  };

  return (
    <div className='wrapper'>
      <div className="sidebar">
        <button onClick={() => navigateCreateUser()}>Додати користувача</button>
      </div>

    <div className="main-content" style={{width: '100%', overflowX: 'auto'}}>
      <h2 className='text-center mb-3 text-bold'>Сторінка користувача</h2>

      <div className="content" >
        <div>{user.userSurname} {user.userName} {user.userPatronymic}</div>
        <div>Роль: {statusMappingRoles[user.userJobTitle] || 'Невідомий статус'}</div>
        <div>Логін: {user.userLogin}</div>
        <div>Пошта: {user.userEmail} </div>
        {/* <span>{user.enableNotification ? (
            <i title="Сповіщення увімкнено" className="bi bi-bell-fill" style={{ color: 'green' }}></i> // іконка для увімкнених сповіщень
        ) : (
            <i title="Сповіщення вимкнено" className="bi bi-bell-slash-fill" style={{ color: 'red' }}></i> // іконка для вимкнених сповіщень
        )}</span> */}

          <Table responsive className="table table-hover mt-5">
              <thead>
                  <tr>
                      <th>Код доручення</th>
                      <th>Дата створення</th>
                      <th>Протокол засідання</th>
                      <th>Джерело</th>
                      <th>Тип</th>
                      <th>Відповідальні</th>
                      <th style={{minWidth: 200}}>Назва</th>
                      <th style={{minWidth: 200}}>Короткий Опис</th>
                      <th style={{minWidth: 200}}>Повний Опис</th>
                      <th>Початок</th>
                      <th>Дедлайн</th>
                      <th>Статус</th>
                      <th></th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  { user.instructions.length > 0 ? (
                  user.instructions.map((instruction, index) => 
                      <tr key={instruction.id} onClick={() => handleRowClick(instruction.code)} style={{ cursor: 'pointer' }}>
                      <td>{instruction.code}</td>
                      <td>{new Date(instruction.makingTime).toLocaleDateString()}</td>
                      <td>{instruction.protocol}</td>
                      <td>{instruction.sourceOfInstruction}</td>
                      <td>{instruction.type}</td>
                      <td>{instruction.users.map(user =>
                          <p  style={{margin: 5}}>{user.userSurname} {user.userName} {user.userPatronymic},<br></br></p>
                      )}</td>
                      <td>{instruction.title}</td>
                      <td>{instruction.shortDescription}</td>
                      <td>{instruction.fullDescription}</td>
                      <td>{new Date(instruction.startTime).toLocaleDateString()}</td>
                      <td>{new Date(instruction.expTime).toLocaleDateString()}</td>
                      <td><span className={`status ${getStatusClass(statusMapping[instruction.status] || 'Невідомий статус')}`}>{statusMapping[instruction.status] || 'Невідомий статус'}</span></td>
                      <td style={{padding: '10px 0'}}><i title="Редагувати" className="bi bi-pencil-square" style={{ fontSize: '18px', margin:0}}
                          onClick={(event) => {
                              event.stopPropagation(); // Зупиняємо спливання події
                              editInstruction(instruction.code); // Викликаємо функцію редагування
                            }}></i></td>
                      <td style={{padding: '10px 0'}}><i title="Видалити" className="bi bi-trash3" style={{ fontSize: '18px', margin:0}}
                          onClick={(event) => {
                              event.stopPropagation();
                              deleteInstruction(instruction.code, navigator);
                            }}></i></td>
                  </tr>)
                  ) : (
                      <tr>
                        <td colSpan="12" style={{ textAlign: 'center' }}>Немає доступних доручень</td>
                      </tr>
                    )
                  }
              </tbody>
          </Table>
    </div>
    </div>
    </div>
  )
}

export default UserComponent