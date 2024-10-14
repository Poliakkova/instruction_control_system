import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { listUsers } from '../sevices/UserService'
import { getKey } from '../sevices/InstructionService'
import Form from 'react-bootstrap/Form';

const CreateInstructionComponent = () => {

//   const [title, setTitle] = useState('')
//   const [headSurname, setHeadSurname] = useState('')
//   const [headName, setHeadName] = useState('')
//   const [headPatronymic, setHeadPatronymic] = useState('')
//   const [headControlSurname, setHeadControlSurname] = useState('')
//   const [headControlName, setHeadControlName] = useState('')
//   const [headControlPatronymic, setHeadControlPatronymic] = useState('')
//   const [status, setStatus] = useState('')
//   const [sourceOfInstruction, setSourceOfInstruction] = useState('')
//   const [shortDescription, setShortDescription] = useState('')
//   const [fullDescription, setFullDescription] = useState('')
//   const [text, setText] = useState('')
//   const [startTime, setStartTime] = useState('')
//   const [expTime, setExpTime] = useState('')

//   function newInstruction(e) {
//     e.preventDefault();

//     const instruction = {title, headSurname, headName, headPatronymic, headControlSurname, headControlName, headControlPatronymic,
//                           status, sourceOfInstruction, shortDescription, fullDescription, text, startTime, expTime}
//     console.log(instruction)
//   }

    function createInstruction(){
        navigator('/instructions/new')
    }

    const [users, setUsers] = useState([])

    useEffect(() => {
        listUsers().then((response) => {
            setUsers(response.data);
        }).catch(error => {
            console.error(error);
        })

    }, [])

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
        status: 'CREATED',
        mapProcess: '',
        users: []
    }); //users, map process

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

  return (
    <div className='wrapper'>
        <div className="sidebar">
            <button onClick={() => createInstruction()}>Створити доручення</button>
            <a className="menu-item" href='/instructions'><i className="bi bi-card-list"></i>Усі</a>
            <a className="menu-item" href='/instructions'><i className="bi bi-archive"></i>Архів</a>
        </div>
 
        <div className="main-content">
            <h2 className='text-center mb-3'>Створіть доручення</h2>
            <div className="content">
            <form onSubmit={addInstruction}>
                <div className="form-floating">
                    <input type="text" className="form-control" id="protocol" placeholder="Протокол засідання кафедри №" onChange={handleChange}  max={255}/>
                    <label htmlFor="protocol">Протокол засідання кафедри №</label>
                </div>

                {/* <div className="form-floating">
                    <input type="date" className="form-control" id="makingTime" placeholder="Дата видачі доручення" onChange={handleChangeDate}/>
                    <label htmlFor="makingTime">Дата видачі доручення</label>
                </div> */}

                <div className="form-floating">
                    <input type="text" className="form-control" id="title" placeholder="Назва доручення" onChange={handleChange} max={255}/>
                    <label htmlFor="title">Назва доручення</label>
                </div>

                <div className="form-floating">
                    <select className="form-select" id="type" aria-label="Тип доручення" onChange={handleChange}  max={255}>
                        <option>Оберіть тип доручення</option>
                        <option value='Науково-методична робота'>Науково-методична робота</option>
                        <option value='Навчально-виховна робота'>Навчально-виховна робота</option>
                        <option value='Профорієнтаційна робота'>Профорієнтаційна робота</option>
                        <option value='Навчально-організаційна робота'>Навчально-організаційна робота</option>
                    </select>
                    <label htmlFor="type">Тип доручення</label>
                </div>

                <div className="form-floating">
                    <input type="text" className="form-control" id="sourceOfInstruction" placeholder="Звідки отримали доручення" onChange={handleChange}  max={255}/>
                    <label htmlFor="sourceOfInstruction">Звідки отримали доручення</label>
                </div>

                <div className="form-floating">
                    <textarea type="text" className="form-control" id="shortDescription" placeholder="Короткий опис доручення" onChange={handleChange}  max={255}/>
                    <label htmlFor="shortDescription">Короткий опис доручення</label>
                </div>

                <div className="form-floating">
                    <textarea type="text" className="form-control" id="text" placeholder="Текст доручення" onChange={handleChange}  max={255}/>
                    <label htmlFor="text">Текст доручення</label>
                </div>

                {/* <div className="form-floating">
                    <select multiple className="form-select" id="users" aria-label="Choose head" onChange={handleChange}
                    style={{height: 200}}>
                        {
                            users.map((user, index) => 
                                <option key={index} value={user.userLogin}>{index+1} {user.userSurname} {user.userName} {user.userPatronymic}</option>
                            )
                        }
                    </select>
                    
                    <label htmlFor="users">Оберіть відповідальних</label>
                </div> */}

                <div className="form-floating">
                    <input type="date" className="form-control" id="startTime" placeholder="Дата початку виконання" onChange={handleChangeDate}/>
                    <label htmlFor="startTime">Дата початку виконання</label>
                </div>

                <div className="form-floating">
                    <input type="date" className="form-control" id="expTime" placeholder="Дата дедлайну" onChange={handleChangeDate}/>
                    <label htmlFor="expTime">Дата дедлайну</label>
                </div>

                <button type="submit" className='add-user-button mt-3 mb-3'>Зберегти доручення</button>
            </form>


{/* 
                <form>
                <div className="form-group mb-2">
                    <label className='form-label'>Назва</label>
                    <input type='text' placeholder='Введіть значення...' name='title' value={title} 
                    className='form-control' onChange={(e) => setTitle(e.target.value)}></input>

                    <div className="head-group row">
                    <div className="col">
                        <label className='form-label'>Прізвище голови</label>
                        <input type='text' placeholder='Введіть значення...' name='headSurname' value={headSurname} 
                        className='form-control' onChange={(e) => setHeadSurname(e.target.value)}></input>
                    </div>

                    <div className="col">
                        <label className='form-label'>Імя голови</label>
                        <input type='text' placeholder='Введіть значення...' name='headName' value={headName} 
                        className='form-control' onChange={(e) => setHeadName(e.target.value)}></input>
                    </div>

                    <div className="col">
                        <label className='form-label'>По-батькові голови</label>
                        <input type='text' placeholder='Введіть значення...' name='headPatronymic' value={headPatronymic} 
                        className='form-control' onChange={(e) => setHeadPatronymic(e.target.value)}></input>
                    </div>
                    </div>

                    <div className="head-control-group row">
                    <div className="col">
                        <label className='form-label'>Прізвище голови відділу</label>
                        <input type='text' placeholder='Введіть значення...' name='headControlSurname' value={headControlSurname} 
                        className='form-control' onChange={(e) => setHeadControlSurname(e.target.value)}></input>
                    </div>

                    <div className="col">
                        <label className='form-label'>Імя голови відділу</label>
                        <input type='text' placeholder='Введіть значення...' name='headControlName' value={headControlName} 
                        className='form-control' onChange={(e) => setHeadControlName(e.target.value)}></input>
                    </div>

                    <div className="col">
                    <label className='form-label'>По-батькові голови відділу</label>
                    <input type='text' placeholder='Введіть значення...' name='headControlPatronymic' value={headControlPatronymic} 
                        className='form-control' onChange={(e) => setHeadControlPatronymic(e.target.value)}></input>
                    </div>
                    </div>

                    <label className='form-label'>Організація</label>
                    <input type='text' placeholder='Введіть значення...' name='sourceOfInstruction' value={sourceOfInstruction} 
                    className='form-control' onChange={(e) => setSourceOfInstruction(e.target.value)}></input>

                    <label className='form-label'>Короткий опис</label>
                    <input type='text' placeholder='Введіть значення...' name='shortDescription' value={shortDescription} 
                    className='form-control' onChange={(e) => setShortDescription(e.target.value)}></input>

                    <label className='form-label'>Повний опис</label>
                    <input type='text' placeholder='Введіть значення...' name='fullDescription' value={fullDescription} 
                    className='form-control' onChange={(e) => setFullDescription(e.target.value)}></input>

                    <label className='form-label'>Текст</label>
                    <textarea type='text' placeholder='Введіть значення...' name='text' value={text} 
                    className='form-control' onChange={(e) => setText(e.target.value)}></textarea>

                    <div className="row">
                    <div className="col">
                        <label className='form-label'>Дата створення</label>
                        <input type='date' placeholder='Введіть значення...' name='startTime' value={startTime} 
                        className='form-control' onChange={(e) => setStartTime(e.target.value)}></input>
                    </div>

                    <div className="col">
                        <label className='form-label'>Дедлайн</label>
                        <input type='date' placeholder='Введіть значення...' name='expTime' value={expTime} 
                        className='form-control date' onChange={(e) => setExpTime(e.target.value)}></input>
                    </div>
                    </div>
                </div>

                <button className='btn btn-success' onClick={newInstruction}>Зберегти</button>
                </form> */}
            </div>
        </div>
    </div>
  )
}

export default CreateInstructionComponent