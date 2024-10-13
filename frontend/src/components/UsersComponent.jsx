import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import '../css/Users.css'
import { listUsers } from '../sevices/UserService'

const UsersComponent = () => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        listUsers().then((response) => {
            setUsers(response.data);
        }).catch(error => {
            console.error(error);
        })

    }, [])

    const navigator = useNavigate();

    function navigateCreateUser(){
        navigator('/users/new')
    }

    return (
    <div className='wrapper'>
        <div className="sidebar">
            <button onClick={navigateCreateUser}>Додати користувача</button>
        </div>

        <div className="main-content">
            <div className="filters">
                <button className='filters-button'>Фільтри</button>
            </div>

            <div className="content">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Роль</th>
                            <th>Логін</th>
                            <th>Прізвище</th>
                            <th>Ім'я</th>
                            <th>По-батькові</th>
                            <th>Пошта</th>
                            <th>Сповіщення</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => 
                                <tr key={user.id} style={{ cursor: 'pointer' }}>
                                    <td>{index + 1}</td>
                                    <td>{user.userJobTitle}</td>
                                    <td>{user.userLogin}</td>
                                    <td>{user.userSurname}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.userPatronymic}</td>
                                    <td>{user.userEmail}</td>
                                    <td style={{textAlign: 'center'}}>{user.enableNotification ? (
                                        <i title="Сповіщення увімкнено" className="bi bi-bell-fill" style={{ color: 'green' }}></i> // іконка для увімкнених сповіщень
                                    ) : (
                                        <i title="Сповіщення вимкнено" className="bi bi-bell-slash-fill" style={{ color: 'red' }}></i> // іконка для вимкнених сповіщень
                                    )}</td>
                                    <td><a href='/users/edit'><i title="Редагувати" className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></a></td>
                                    <td><i className="bi bi-trash3" title="Видалити" style={{ fontSize: '18px'}}></i></td>
                                </tr>
                            )
                        }
                        {/* <tr onClick={() => handleRowClick(1)} style={{ cursor: 'pointer' }}>
                            <td>1</td>
                            <td>Адмін</td>
                            <td>Іванов</td>
                            <td>Іван</td>
                            <td>Іванович</td>
                            <td>email1@gmail.com</td>
                            <td><a href='/users/edit'><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></a></td>
                            <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Студ.представник</td>
                            <td>Петренко</td>
                            <td>Петро</td>
                            <td>Петрович</td>
                            <td>email1@gmail.com</td>
                            <td><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></td>
                            <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Викладач</td>
                            <td>Семенков</td>
                            <td>Семен</td>
                            <td>Семенович</td>
                            <td>email1@gmail.com</td>
                            <td><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></td>
                            <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Викладач</td>
                            <td>Тарасенко</td>
                            <td>Тарас</td>
                            <td>Тарасович</td>
                            <td>email1@gmail.com</td>
                            <td><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></td>
                            <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default UsersComponent