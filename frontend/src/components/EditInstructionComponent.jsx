import React, { useState, useEffect } from 'react'
import {useNavigate, useParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { listUsers } from '../sevices/UserService'
import { getKey } from '../sevices/InstructionService'
import axios from 'axios';

const EditInstructionComponent = () => {

    const navigator = useNavigate();

    function createInstruction(){
        navigator('/instructions/new')
    }

    const { title } = useParams(); // Отримуємо параметр title з URL

    const [instruction, setInstruction] = useState({
        makingTime: '',
        protocol: '',
        title: '',
        type: '',
        sourceOfInstruction: '',
        shortDescription: '',
        text: '',
        startTime: '',
        expTime: '',
        mapProcess: '',
        users: []
    }); 

    useEffect(() => {
        const fetchInstruction = async () => {
            try {
                // Отримання ключа
                const keyResponse = await getKey();
                const uuidKey = keyResponse.data;
                console.log("uuidKey " + uuidKey);

                const response = await axios.get(`http://localhost:8090/instructions/get/${encodeURIComponent(title)}`, {
                    headers: {
                        'key': uuidKey, // передайте ваш ключ у заголовку
                    },
                });
                setInstruction(response.data);
            } catch (error) {
                console.error('Error fetching instruction:', error);
            }
        };
    fetchInstruction();
    }, [title]);

    // Цей useEffect буде викликаний кожного разу, коли зміниться instruction
    useEffect(() => {
    console.log("INSTRUCTION UPDATED: ", instruction);
    }, [instruction]);

    const [users, setUsers] = useState([])

    useEffect(() => {
        listUsers().then((response) => {
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

    const addInstruction = async (e) => {
        e.preventDefault();
        console.log(JSON.stringify(instruction));
        
        try {
            e.preventDefault();
            console.log(JSON.stringify(instruction));
    
            // Отримання ключа
            const keyResponse = await getKey();
            const uuidKey = keyResponse.data;
    
            console.log("uuidKey " + uuidKey);
    
            // Додавання ключа до HTTP-запиту
            const response = await fetch("http://localhost:8090/instructions/new/processing", {
                method: 'POST',
                headers: {
                    'key': uuidKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(instruction)
            });
    
            if (response.ok) {
                alert('Доручення успішно створене');
            } else {
                alert('Помилка при створенні доручення. Перевірте дані');
                }
    
        }catch (error) {
            console.error(error);
            throw error;
        }
    };

    // Створюємо стан для пошукового запиту
    const [searchTerm, setSearchTerm] = useState('');

    // Фільтрація даних на основі пошукового запиту
    const filteredData = users.filter((item) => {
        const searchWords = searchTerm.toLowerCase().trim();
        const itemText = item.userSurname + " " + item.userName + " " + item.userPatronymic;
        return itemText.toLowerCase().includes(searchWords)
    });

    const [selectedUsers, setSelectedUsers] = useState([]);

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
        <div className="sidebar">
            <button onClick={() => createInstruction()}>Створити доручення</button>
            <a className="menu-item" href='/instructions'><i className="bi bi-card-list"></i>Усі</a>
            <a className="menu-item" href='/instructions/archived'><i className="bi bi-archive"></i>Архів</a>
        </div>
 
        <div className="main-content">
            <h2 className='text-center mb-3'>Виправте доручення</h2>
            <div className="content">
            <form onSubmit={addInstruction}>
                <div className="form-floating">
                    <input type="text" className="form-control" id="protocol" placeholder="Протокол засідання кафедри №" 
                    onChange={handleChange}  max={255} value={instruction.protocol}/>
                    <label htmlFor="protocol">Протокол засідання кафедри №</label>
                </div>

                <div className="form-floating">
                    <input type="date" className="form-control" id="makingTime" placeholder="Дата видачі доручення" 
                    onChange={handleChangeMakingDate} value={formatDate(instruction.makingTime)}/>
                    <label htmlFor="makingTime">Дата видачі доручення</label>
                </div>

                <div className="form-floating">
                    <input type="text" className="form-control" id="title" placeholder="Назва доручення" 
                    onChange={handleChange} max={255} value={instruction.title}/>
                    <label htmlFor="title">Назва доручення</label>
                </div>

                <div className="form-floating">
                    <select className="form-select" id="type" aria-label="Тип доручення" 
                    onChange={handleChange}  max={255} value={instruction.type}>
                        <option disabled>Оберіть тип доручення</option>
                        <option value='Науково-методична робота'>Науково-методична робота</option>
                        <option value='Навчально-виховна робота'>Навчально-виховна робота</option>
                        <option value='Профорієнтаційна робота'>Профорієнтаційна робота</option>
                        <option value='Навчально-організаційна робота'>Навчально-організаційна робота</option>
                    </select>
                    <label htmlFor="type">Тип доручення</label>
                </div>

                <div className="form-floating">
                    <input type="text" className="form-control" id="sourceOfInstruction" placeholder="Звідки отримали доручення" 
                    onChange={handleChange}  max={255} value={instruction.sourceOfInstruction}/>
                    <label htmlFor="sourceOfInstruction">Звідки отримали доручення</label>
                </div>

                <div className="form-floating">
                    <textarea type="text" className="form-control" id="shortDescription" placeholder="Короткий опис доручення" 
                    onChange={handleChange}  max={255} value={instruction.shortDescription}/>
                    <label htmlFor="shortDescription">Короткий опис доручення</label>
                </div>

                <div className="form-floating">
                    <textarea type="text" className="form-control" id="text" placeholder="Текст доручення" 
                    onChange={handleChange}  max={255} value={instruction.text} style={{height: 'fit-content'}}/>
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
                                <div class="form-check" key={user.userLogin}>
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
                    <input type="date" className="form-control" id="startTime" placeholder="Дата початку виконання" 
                    onChange={handleChangeDate} value={instruction.startTime.split('T')[0]}/>
                    <label htmlFor="startTime">Дата початку виконання</label>
                </div>

                <div className="form-floating">
                    <input type="date" className="form-control" id="expTime" placeholder="Дата дедлайну" 
                    onChange={handleChangeDate} value={instruction.expTime.split('T')[0]}/>
                    <label htmlFor="expTime">Дата дедлайну</label>
                </div>

                <button type="submit" className='add-user-button mt-3 mb-3'>Оновити доручення</button>
            </form>
            </div>
        </div>
    </div>
  )
}

export default EditInstructionComponent