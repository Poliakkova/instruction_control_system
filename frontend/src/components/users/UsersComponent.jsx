import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';

import { listUsers, deleteUser } from '../../sevices/UserService'
import { statusMappingRoles } from '../instructions/js/statusUtils';
import SideBarUserComponent from '../panels/SideBarUserComponent';

import '../../css/Users.css'

const UsersComponent = () => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        listUsers(localStorage.getItem("token")).then((response) => {
            setUsers(response.data);
        }).catch(error => {
            console.error(error);
        })

    }, [])

    const navigator = useNavigate();

    const handleRowClick = (userLogin) => {
        navigator(`/users/${encodeURIComponent(userLogin)}`);
    };

    const editUser = (userLogin) => {
        navigator(`/users/edit/${encodeURIComponent(userLogin)}`);
    };

    const [filteredUsers, setFilteredUsers] = useState([]);
    const availableRoles = ["ADMIN", "TEACHER", "STUDENT"];
    const [filters, setFilters] = useState({
        role: []
    });

    // Створюємо стан для пошукового запиту
    const [searchTerm, setSearchTerm] = useState('');

    const applyFiltersAndSearch  = () => {
        let filtered = users;

        // Filter by selected types
        if (filters.role.length > 0) {
            filtered = filtered.filter(user => filters.role.includes(user.userJobTitle));
        }

        // Apply the search term
        const searchWords = searchTerm.toLowerCase().trim();
        if (searchWords) {
            filtered = filtered.filter((item) => {
                return (
                    item.userSurname.toLowerCase().includes(searchWords) ||
                    item.userName.toLowerCase().includes(searchWords) ||
                    item.userPatronymic.toLowerCase().includes(searchWords) ||
                    item.userLogin.toLowerCase().includes(searchWords) ||
                    statusMappingRoles[item.userJobTitle].toLowerCase().includes(searchWords) ||
                    item.userEmail.toLowerCase().includes(searchWords)
                );
            });
        }

        setFilteredUsers(filtered);
    };

    // Automatically apply filters and search when filters or search term changes
    useEffect(() => {
        applyFiltersAndSearch();
    }, [filters, searchTerm, users]);

    // Handle changes in search term
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCheckboxChange = (event, role) => {
        const { name, checked } = event.target;
        setFilters((prevFilters) => {
            const updatedArray = checked
                ? [...prevFilters[name], role]  // Add type/status if checked
                : prevFilters[name].filter((item) => item !== role); // Remove if unchecked

            return { ...prevFilters, [name]: updatedArray };
        });
    };

    return (
    <div className='wrapper'>
        <SideBarUserComponent />

        <div className="main-content">
            <div className="filters">
            <Dropdown>
                        <Dropdown.Toggle className='filters-button' id="dropdown-basic">
                            Фільтри
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{width: 340, boxShadow: '10px 5px 20px #e1eaf0'}}>
                            <div className="px-3">
                                <div className='mt-2'>
                                    <label style={{color: '#3782e2'}}>Роль:</label>
                                    {availableRoles.map((role) => (
                                        <div key={role}>
                                            <input
                                                type="checkbox"
                                                name="role"
                                                id={role}
                                                value={role}
                                                onChange={(e) => handleCheckboxChange(e, role)}
                                            />
                                            <label htmlFor={role}>{statusMappingRoles[role]}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>

                    <input
                    type="text"
                    placeholder="Пошук за полем..."
                    className="me-2 input-search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={handleSearchChange} // Оновлюємо стан при введенні
                    />
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
                        { filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => 
                                <tr key={user.id} style={{ cursor: 'pointer' }} onClick={() => handleRowClick(user.userLogin)}>
                                    <td>{index + 1}</td>
                                    <td>{statusMappingRoles[user.userJobTitle] || 'Невідомий статус'}</td>
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
                                    <td><a onClick={(event) => {
                                        event.stopPropagation(); // Зупиняємо спливання події
                                        editUser(user.userLogin); // Викликаємо функцію редагування
                                      }}><i title="Редагувати" className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></a></td>
                                    <td><i onClick={() => deleteUser(user.userLogin, navigator, localStorage.getItem("token"))} className="bi bi-trash3" title="Видалити" style={{ fontSize: '18px'}}></i></td>
                                </tr>
                            )) : (
                            <tr>
                              <td colSpan="12" style={{ textAlign: 'center' }}>Немає доступних користувачів</td>
                            </tr>
                          )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default UsersComponent