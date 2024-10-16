import React, {useEffect, useState, useRef } from 'react'
import {useNavigate} from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';

import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/ListInstructions.css'

import { listInstructions, deleteInstruction } from '../sevices/InstructionService'

const ListInstructionsComponent = () => {

    const [instructions, setInstructions] = useState([])

    const navigator = useNavigate();

    useEffect(() => {
        listInstructions().then((response) => {
            setInstructions(response.data);
            setFilteredInstructions(response.data);
        }).catch(error => {
            console.error(error);
        })

    }, [])

    function createInstruction(){
        navigator('/instructions/new');
    };

    const editInstruction = (code) => {
        navigator(`/instructions/edit/${encodeURIComponent(code)}`);
    };

    const handleRowClick = (code) => {
        navigator(`/instructions/${encodeURIComponent(code)}`);
    };

    const statusMapping = {
        CREATED: 'Назначено',
        CONFIRMATION: 'Очікує затвердження',
        IN_PROGRESS: 'В роботі',
        CANCELLED: 'Скасовано',
        FINISHED: 'Затверджено',
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
        case 'Затверджено':
            return 'status grey';
        default:
            return 'status grey';
        }
    };

    const [filteredInstructions, setFilteredInstructions] = useState([]);
    const availableTypes = ["Науково-методична робота", "Навчально-виховна робота", "Профорієнтаційна робота", "Навчально-організаційна робота"];
    const availableStatuses = ["Назначено", "В роботі", "Очікує затвердження", "Затверджено"];
    const [filters, setFilters] = useState({
        makingTimeFrom: '',
        makingTimeTo: '',
        startTimeFrom: '',
        startTimeTo: '',
        expTimeFrom: '',
        expTimeTo: '',
        type: [],
        status: [],
    });
    // Створюємо стан для пошукового запиту
    const [searchTerm, setSearchTerm] = useState('');

    const applyFiltersAndSearch  = () => {
        let filtered = instructions;

        // Filter by date range
        if (filters.makingTimeFrom) {
            filtered = filtered.filter(instruction => {
                console.log("1 instr.data: " + new Date(instruction.makingTime) + " filter.data: " + new Date(filters.makingTimeFrom));
                console.log(new Date(instruction.makingTime) >= new Date(filters.makingTimeFrom));
                return new Date(instruction.makingTime) >= new Date(filters.makingTimeFrom)});
        }
        if (filters.makingTimeTo) {
            filtered = filtered.filter(instruction => {
                console.log("2 instr.data: " + new Date(instruction.makingTime) + " filter.data: " + new Date(filters.makingTimeTo));
                return new Date(instruction.makingTime) <= new Date(filters.makingTimeTo)});
        }
        if (filters.startTimeFrom) {
            filtered = filtered.filter(instruction => {
                console.log("3 instr.data: " + new Date(instruction.startTime) + " filter.data: " + new Date(filters.startTimeFrom));
                return new Date(instruction.startTime) >= new Date(filters.startTimeFrom)});
        }
        if (filters.startTimeTo) {
            filtered = filtered.filter(instruction => {
                console.log("4 instr.data: " + new Date(instruction.startTime) + " filter.data: " + new Date(filters.startTimeTo));
                console.log(new Date(instruction.startTime) <= new Date(filters.startTimeTo));
                return new Date(instruction.startTime) <= new Date(filters.startTimeTo)});
        }
        if (filters.expTimeFrom) {
            filtered = filtered.filter(instruction => {
                console.log("5 instr.data: " + new Date(instruction.expTime) + " filter.data: " + new Date(filters.expTimeFrom));
                return new Date(instruction.expTime) >= new Date(filters.expTimeFrom)});
        }
        if (filters.expTimeTo) {
            filtered = filtered.filter(instruction => {
                console.log("6 instr.data: " + new Date(instruction.expTime) + " filter.data: " + new Date(filters.expTimeTo));
                return new Date(instruction.expTime) <= new Date(filters.expTimeTo)});
        }

        // Filter by selected types
        if (filters.type.length > 0) {
            filtered = filtered.filter(instruction => filters.type.includes(instruction.type));
        }

        // Filter by selected statuses
        if (filters.status.length > 0) {
            filtered = filtered.filter(instruction => filters.status.includes(statusMapping[instruction.status]));
        }

        // Apply the search term
        const searchWords = searchTerm.toLowerCase().trim();
        if (searchWords) {
            filtered = filtered.filter((item) => {
                return (
                    new Date(item.makingTime).toLocaleDateString().toLowerCase().includes(searchWords) ||
                    item.sourceOfInstruction.toLowerCase().includes(searchWords) ||
                    item.protocol.toLowerCase().includes(searchWords) ||
                    item.type.toLowerCase().includes(searchWords) ||
                    item.title.toLowerCase().includes(searchWords) ||
                    item.shortDescription.toLowerCase().includes(searchWords) ||
                    item.code.toLowerCase().includes(searchWords) ||
                    new Date(item.startTime).toLocaleDateString().toLowerCase().includes(searchWords) ||
                    new Date(item.expTime).toLocaleDateString().toLowerCase().includes(searchWords) ||
                    statusMapping[item.status].toLowerCase().includes(searchWords)
                );
            });
        }

        setFilteredInstructions(filtered);
    };

    // Automatically apply filters and search when filters or search term changes
    useEffect(() => {
        applyFiltersAndSearch();
    }, [filters, searchTerm, instructions]);

    // Handle changes in search term
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleCheckboxChange = (event, type) => {
        const { name, checked } = event.target;
        setFilters((prevFilters) => {
            const updatedArray = checked
                ? [...prevFilters[name], type]  // Add type/status if checked
                : prevFilters[name].filter((item) => item !== type); // Remove if unchecked

            return { ...prevFilters, [name]: updatedArray };
        });
    };

    return (
    <body>
        <div className="wrapper">
            <div className="sidebar">
                <button onClick={() => createInstruction()}>Створити доручення</button>
                <a className="menu-item" href='/instructions'><i className="bi bi-card-list"></i>Усі</a>
                <a className="menu-item" href='/instructions/archived'><i className="bi bi-archive"></i>Архів</a>
            </div>

            <div className="main-content" style={{width: '100%', overflowX: 'auto'}}>
                <div className="filters">
                    <Dropdown>
                        <Dropdown.Toggle className='filters-button' id="dropdown-basic">
                            Фільтри
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{width: 340, boxShadow: '10px 5px 20px #e1eaf0'}}>
                            <div className="px-3">
                                <span className='d-block' style={{color: '#3782e2'}}>Дата створення</span>
                                <label>з: <input className='filter-input' type="date" name="makingTimeFrom" onChange={handleFilterChange} /></label>
                                <label>до: <input className='filter-input' type="date" name="makingTimeTo" onChange={handleFilterChange} /></label>
                                <br></br>
                                <span className='d-block mt-2' style={{color: '#3782e2'}}>Дата початку</span>
                                <label>з: <input className='filter-input' type="date" name="startTimeFrom" onChange={handleFilterChange} /></label>
                                <label>до: <input className='filter-input' type="date" name="startTimeTo" onChange={handleFilterChange} /></label>
                                <br></br>
                                <span className='d-block mt-2' style={{color: '#3782e2'}}>Дедлайн</span>
                                <label>з: <input className='filter-input' type="date" name="expTimeFrom" onChange={handleFilterChange} /></label>
                                <label>до: <input className='filter-input' type="date" name="expTimeTo" onChange={handleFilterChange} /></label>
                                <br></br>
                                {/* Checkbox filters for Types */}
                                <div className='mt-2'>
                                    <label style={{color: '#3782e2'}}>Тип:</label>
                                    {availableTypes.map((type) => (
                                        <div key={type}>
                                            <input
                                                type="checkbox"
                                                name="type"
                                                value={type}
                                                onChange={(e) => handleCheckboxChange(e, type)}
                                            />
                                            <label htmlFor='type'>{type}</label>
                                        </div>
                                    ))}
                                </div>

                                {/* Checkbox filters for Statuses */}
                                <div className='mt-2'>
                                    <label style={{color: '#3782e2'}}>Статус:</label>
                                    {availableStatuses.map((status) => (
                                        <div key={status}>
                                            <input
                                                type="checkbox"
                                                name="status"
                                                value={status}
                                                onChange={(e) => handleCheckboxChange(e, status)}
                                            />
                                            <label htmlFor='status'>{status}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>

                    <input
                    type="text"
                    placeholder="Пошук за ключовими словами..."
                    className="input-search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={handleSearchChange} // Оновлюємо стан при введенні
                    />
                </div>

                <div className="content">
                    <Table responsive className="table table-hover">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Дата створення</th>
                                <th>Протокол засідання</th>
                                <th>Джерело</th>
                                <th>Тип</th>
                                <th>Відповідальні</th>
                                <th style={{minWidth: 200}}>Назва</th>
                                <th style={{minWidth: 200}}>Опис</th>
                                <th>Початок</th>
                                <th>Дедлайн</th>
                                <th>Статус</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { filteredInstructions.length > 0 ? (
                            filteredInstructions.map((instruction, index) => 
                                <tr key={instruction.id} onClick={() => handleRowClick(instruction.code)} style={{ cursor: 'pointer' }}>
                                <td>{instruction.code}</td>
                                <td>{new Date(instruction.makingTime).toLocaleDateString()}</td>
                                <td>{instruction.protocol}</td>
                                <td>{instruction.sourceOfInstruction}</td>
                                <td>{instruction.type}</td>
                                <td>{instruction.users.map(user =>
                                    <p style={{margin: 5}}>{user.userSurname} {user.userName} {user.userPatronymic},<br></br></p>
                                )}</td>
                                <td>{instruction.title}</td>
                                <td>{instruction.shortDescription}</td>
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
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
    </body>
    )
}

export default ListInstructionsComponent