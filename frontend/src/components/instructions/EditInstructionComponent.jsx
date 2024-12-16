import React, { useState, useEffect } from 'react'
import {useNavigate, useParams } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

import SideBarInstructionComponent from '../panels/SideBarInstructionComponent';
import { listUsers } from '../../sevices/UserService'
import { getInstruction, updateInstruction } from '../../sevices/InstructionService'

const EditInstructionComponent = () => {

    const navigator = useNavigate();

    const { code } = useParams(); // Отримуємо параметр title з URL

    const [instruction, setInstruction] = useState({
        code: code,
        makingTime: '',
        protocol: '',
        title: '',
        type: '',
        sourceOfInstruction: '',
        shortDescription: '',
        fullDescription: '',
        text: '',
        startTime: '',
        expTime: '',
        mapProcess: '',
        users: []
    }); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit - instruction " + instruction);
        updateInstruction(instruction, navigator, localStorage.getItem("token"));
    };

    useEffect(() => {
        const fetchInstruction = async () => {
            // Отримання інструкції за кодом
            const instructionData = await getInstruction(code, localStorage.getItem("token"));
            console.log("Response data: ", instructionData); 
            setInstruction(instructionData);
        };
        fetchInstruction();
    }, [code]);

    // Цей useEffect буде викликаний кожного разу, коли зміниться instruction
    useEffect(() => {
    console.log("INSTRUCTION UPDATED: ", instruction);
    }, [instruction]);

    const [users, setUsers] = useState([])

    useEffect(() => {
        listUsers(localStorage.getItem("token")).then((response) => {
            setUsers(response.data);
        }).catch(error => {
            console.error(error);
        })

    }, [])

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
        const isAlreadySelected = instruction.users.some(user => user.userLogin === userLogin);
        const updatedUsers = isAlreadySelected 
            ? instruction.users.filter(user => user.userLogin !== userLogin) // Видаляємо користувача
            : [...instruction.users, users.find(user => user.userLogin === userLogin)]; // Додаємо користувача

        setInstruction((prevInstruction) => ({
            ...prevInstruction,
            users: updatedUsers
        }));
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return ''; // Якщо timestamp не задано
        const date = new Date(timestamp);
        console.log("DATE: " + date.toISOString().split('T')[0]);
        return date.toISOString().split('T')[0]; // Отримуємо тільки yyyy-MM-dd
    };

  return (
    <div className='wrapper'>
        <SideBarInstructionComponent />
 
        <div className="main-content">
            <h2 className='text-center mb-3'>Виправте доручення</h2>
            <div className="content">
            <form onSubmit={handleSubmit}>
                <div style={{margin: 10, fontWeight: 600}}>Код доручення: {instruction.code}</div>
                <div className="form-floating">
                    <input required type="text" className="form-control" id="protocol" placeholder="Протокол засідання кафедри №" 
                    onChange={handleChange}  maxLength={255} value={instruction.protocol}/>
                    <label htmlFor="protocol">Протокол засідання кафедри №</label>
                </div>

                <div className="form-floating">
                    <input required type="date" className="form-control" id="makingTime" placeholder="Дата видачі доручення" 
                    onChange={handleChangeMakingDate} value={formatDate(instruction.makingTime)}/>
                    <label htmlFor="makingTime">Дата видачі доручення</label>
                </div>

                <div className="form-floating">
                    <input required type="text" className="form-control" id="title" placeholder="Назва доручення" 
                    onChange={handleChange} maxLength={255} value={instruction.title}/>
                    <label htmlFor="title">Назва доручення</label>
                </div>

                <div className="form-floating">
                    <select required className="form-select" id="type" aria-label="Тип доручення" 
                    onChange={handleChange}  maxLength={255} value={instruction.type}>
                        <option value='Науково-методична робота'>Науково-методична робота</option>
                        <option value='Навчально-виховна робота'>Навчально-виховна робота</option>
                        <option value='Профорієнтаційна робота'>Профорієнтаційна робота</option>
                        <option value='Навчально-організаційна робота'>Навчально-організаційна робота</option>
                    </select>
                    <label htmlFor="type">Напрям доручення</label>
                </div>

                <div className="form-floating">
                    <input required type="text" className="form-control" id="sourceOfInstruction" placeholder="Звідки отримали доручення" 
                    onChange={handleChange}  maxLength={255} value={instruction.sourceOfInstruction}/>
                    <label htmlFor="sourceOfInstruction">Звідки отримали доручення</label>
                </div>

                <div className="form-floating">
                    <textarea required type="text" className="form-control" id="shortDescription" placeholder="Короткий опис доручення" 
                    onChange={handleChange}  maxLength={255} value={instruction.shortDescription}/>
                    <label htmlFor="shortDescription">Короткий опис доручення</label>
                </div>

                <div className="form-floating">
                    <textarea required type="text" className="form-control" id="fullDescription" placeholder="Повний опис доручення" 
                    onChange={handleChange}  maxLength={255} value={instruction.fullDescription}/>
                    <label htmlFor="fullDescription">Повний опис доручення</label>
                </div>

                <div className="form-floating">
                    <textarea required type="text" className="form-control" id="text" placeholder="Текст доручення" 
                    onChange={handleChange}  maxLength={255} value={instruction.text} style={{height: 'fit-content'}}/>
                    <label htmlFor="text">Текст доручення</label>
                </div>

                <div className="custom-form-floating" style={{
                    border: '1px solid #dee2e6',
                    borderRadius: 6,
                    padding: '16px 12px'}}>
                    <div style={{marginBottom: 10}}>Оберіть виконавця</div>
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
                                    checked={instruction.users.some(u => u.userLogin === user.userLogin)} // Перевіряємо, чи обраний користувач
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
                    <input required type="date" className="form-control" id="expTime" placeholder="Дата дедлайну" 
                    onChange={handleChangeDate} value={instruction.expTime.split('T')[0]}/>
                    <label htmlFor="expTime">Виконати до</label>
                </div>

                <button type="submit" className='add-user-button mt-3 mb-3'>Оновити доручення</button>
            </form>
            </div>
        </div>
    </div>
  )
}

export default EditInstructionComponent