import React from 'react'
import {useNavigate} from 'react-router-dom'
import '../css/Users.css'

const UsersComponent = () => {

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
                            <th><input type='checkbox'/></th>
                            <th onclick={() => sortTable(0)}>№</th>
                            <th onclick={() => sortTable(4)}>Роль</th>
                            <th onclick={() => sortTable(1)}>Прізвище</th>
                            <th onclick={() => sortTable(2)}>Ім'я</th>
                            <th onclick={() => sortTable(3)}>По-батькові</th>
                            <th onclick={() => sortTable(3)}>Пошта</th>
                            <th onclick={() => sortTable(3)}></th>
                            <th onclick={() => sortTable(5)}></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onClick={() => handleRowClick(1)} style={{ cursor: 'pointer' }}>
                            <td><input type='checkbox'/></td>
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
                            <td><input type='checkbox'/></td>
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
                            <td><input type='checkbox'/></td>
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
                            <td><input type='checkbox'/></td>
                            <td>4</td>
                            <td>Викладач</td>
                            <td>Тарасенко</td>
                            <td>Тарас</td>
                            <td>Тарасович</td>
                            <td>email1@gmail.com</td>
                            <td><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></td>
                            <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default UsersComponent