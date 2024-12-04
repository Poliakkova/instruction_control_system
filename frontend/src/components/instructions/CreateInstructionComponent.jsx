import React, { useState, useEffect } from 'react'
import {useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import SideBarInstructionComponent from '../panels/SideBarInstructionComponent';
import { listUsers } from '../../sevices/UserService'
import { createInstruction } from '../../sevices/InstructionService'

const CreateInstructionComponent = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([])

    useEffect(() => {
        listUsers(localStorage.getItem("token")).then((response) => {
            setUsers(response.data);
        }).catch(error => {
            console.error(error);
        })

    }, [])

    const [instruction, setInstruction] = useState({
        code: `${new Date().getTime()}`,
        makingTime: '',
        protocol: '',
        title: '',
        type: '',
        sourceOfInstruction: '',
        full: '',
        shortDescription: '',
        text: '',
        startTime: '',
        expTime: '',
        status: 'CREATED',
        mapProcess: '',
        users: [],
        comment: ''
    }); //users, map process

    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        console.log("ID, VALUE " + id + " " + value);
        setInstruction(prevState => ({
        ...prevState,
        [id]: value
        }));
    };

    const handleChangeDate = (e) => {
        const { id, value } = e.target;
        const dateObject = new Date(value); 
        const isoDateString = dateObject.toISOString();
        console.log("ID, VALUE " + id + " " + isoDateString);
        setInstruction(prevState => ({
        ...prevState,
        [id]: isoDateString
        }));
    };

    const handleChangeMakingDate = (e) => {
        const { id, value } = e.target;
        const timestamp = new Date(value).getTime(); // Перетворюємо у мілісекунди
        console.log("ID, VALUE " + id + " " + timestamp);

        setInstruction(prevState => ({
            ...prevState,
            [id]: timestamp
            }));
    };

    // Створюємо стан для пошукового запиту
    const [searchTerm, setSearchTerm] = useState('');

    // Фільтрація даних на основі пошукового запиту
    const filteredData = users.filter((item) => {
        const searchWords = searchTerm.toLowerCase().trim();
        const itemText = item.userSurname + " " + item.userName + " " + item.userPatronymic;
        return itemText.toLowerCase().includes(searchWords)
    });

    const handleCheckboxChange = (userLogin) => {
        setSelectedUsers((prevSelectedUsers) => {
            const isAlreadySelected = prevSelectedUsers.some(user => user.userLogin === userLogin);
            let updatedSelectedUsers;
    
            if (isAlreadySelected) {
                // Якщо користувач уже є, видаляємо його з масиву
                updatedSelectedUsers = prevSelectedUsers.filter(user => user.userLogin !== userLogin);
            } else {
                // Якщо користувача ще немає, додаємо його до масиву
                updatedSelectedUsers = [...prevSelectedUsers, { userLogin }];
            }
    
            // Оновлюємо поле users в об'єкті instruction
            setInstruction((prevInstruction) => ({
                ...prevInstruction,
                users: updatedSelectedUsers
            }));
    
            return updatedSelectedUsers;
        });
    };
    

  return (
    <div className='wrapper'>
        <SideBarInstructionComponent />
 
        <div className="main-content">
            <h2 className='text-center mb-3'>Створіть доручення</h2>
            <div className="content">
            <form onSubmit={() => createInstruction(event, instruction, navigate, localStorage.getItem("token"))}>
                <div className="form-floating">
                    <input required type="text" className="form-control" id="protocol" placeholder="Протокол засідання кафедри №" 
                    onChange={handleChange}  maxLength={255}/>
                    <label htmlFor="protocol">Протокол засідання кафедри №</label>
                </div>

                <div className="form-floating">
                    <input required type="date" className="form-control" id="makingTime" placeholder="Дата видачі доручення" 
                    onChange={handleChangeMakingDate}/>
                    <label htmlFor="makingTime">Дата видачі доручення</label>
                </div>

                <div className="form-floating">
                    <input required type="text" className="form-control" id="title" placeholder="Назва доручення" 
                    onChange={handleChange} maxLength={255}/>
                    <label htmlFor="title">Назва доручення</label>
                </div>

                <div className="form-floating">
                    <select required className="form-select" id="type" aria-label="Тип доручення" onChange={handleChange}  maxLength={255}>
                        <option selected value='Науково-методична робота'>Оберіть тип доручення</option>
                        <option value='Науково-методична робота'>Науково-методична робота</option>
                        <option value='Навчально-виховна робота'>Навчально-виховна робота</option>
                        <option value='Профорієнтаційна робота'>Профорієнтаційна робота</option>
                        <option value='Навчально-організаційна робота'>Навчально-організаційна робота</option>
                    </select>
                    <label htmlFor="type">Тип доручення</label>
                </div>

                <div className="form-floating">
                    <input required type="text" className="form-control" id="sourceOfInstruction" placeholder="Звідки отримали доручення" 
                    onChange={handleChange}  maxLength={255}/>
                    <label htmlFor="sourceOfInstruction">Звідки отримали доручення</label>
                </div>

                <div className="form-floating">
                    <textarea required type="text" className="form-control" id="shortDescription" placeholder="Короткий опис доручення" 
                    onChange={handleChange}  maxLength={255}/>
                    <label htmlFor="shortDescription">Короткий опис доручення</label>
                </div>

                <div className="form-floating">
                    <textarea required type="text" className="form-control" id="fullDescription" placeholder="Повний опис доручення" 
                    onChange={handleChange}  maxLength={255}/>
                    <label htmlFor="fullDescription">Повний опис доручення</label>
                </div>

                <div className="form-floating">
                    <textarea required type="text" className="form-control" id="text" placeholder="Текст доручення" 
                    onChange={handleChange}  maxLength={255} style={{height: 'fit-content'}}/>
                    <label htmlFor="text">Текст доручення</label>
                </div>

                <div className="custom-form-floating" style={{
                    border: '1px solid #dee2e6',
                    borderRadius: 6,
                    padding: '16px 12px'}}>
                    <div style={{marginBottom: 10}}>Оберіть відповідальних</div>
                    <div>
                        <input type="text"
                        placeholder="Пошук за іменем..."
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Оновлюємо стан при введенні
                        style={{border: '1px solid #dee2e6',
                            borderRadius: 6,
                            padding: '5px 10px',
                            width: 300,
                            marginBottom: 10,}}
                        />
                        <div style={{maxHeight: 100, overflowY: 'auto'}}>
                        {
                            filteredData.map((user) => 
                                <div className="form-check" key={user.userLogin}>
                                    <input className="form-check-input" type="checkbox" id={user.userLogin}
                                    checked={selectedUsers.some(selected => selected.userLogin === user.userLogin)}// Перевірка чи обраний користувач
                                    onChange={() => handleCheckboxChange(user.userLogin)} // Обробка зміни
                                    />
                                    <label className="form-check-label" htmlFor={user.userLogin}>{user.userSurname} {user.userName} {user.userPatronymic}</label>
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>

                <div className="form-floating">
                    <input required type="date" className="form-control" id="startTime" placeholder="Дата початку виконання" 
                    onChange={handleChangeDate}/>
                    <label htmlFor="startTime">Дата початку виконання</label>
                </div>

                <div className="form-floating">
                    <input required type="date" className="form-control" id="expTime" placeholder="Дата дедлайну" 
                    onChange={handleChangeDate}/>
                    <label htmlFor="expTime">Дата дедлайну</label>
                </div>

                <button type="submit" className='add-user-button mt-3 mb-3'>Зберегти доручення</button>
            </form>
            </div>
        </div>
    </div>
  )
}

export default CreateInstructionComponent