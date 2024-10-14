import React, {useEffect, useState} from 'react'
import { listInstructions } from '../sevices/InstructionService'
import {useNavigate} from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/ListInstructions.css'

const ListInstructionsComponent = () => {

    const [instructions, setInstructions] = useState([])

    const navigator = useNavigate();

    useEffect(() => {
        listInstructions().then((response) => {
            setInstructions(response.data);
        }).catch(error => {
            console.error(error);
        })

    }, [])

    function createInstruction(){
        navigator('/instructions/new')
    }

    const handleRowClick = (title) => {
        navigator(`/instruction/${encodeURIComponent(title)}`);
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

    // Створюємо стан для пошукового запиту
    const [searchTerm, setSearchTerm] = useState('');

    // Фільтрація даних на основі пошукового запиту
    const filteredData = instructions.filter((item) => {
        const searchWords = searchTerm.toLowerCase().trim().split(' ');
        console.log("SEARCH " + searchTerm);
        console.log("DATE " + new Date(item.startTime).toLocaleDateString())
        console.log("DATE2 " + new Date(item.expTime).toLocaleDateString())

        return searchWords.some((word) => 
            new Date(item.makingTime).toLocaleDateString().toLowerCase().includes(word) ||
            item.sourceOfInstruction.toLowerCase().includes(word) ||
            item.protocol.toLowerCase().includes(word) ||
            item.type.toLowerCase().includes(word) ||
            item.title.toLowerCase().includes(word) ||
            item.shortDescription.toLowerCase().includes(word) ||
            new Date(item.startTime).toLocaleDateString().toLowerCase().includes(word) ||
            new Date(item.expTime).toLocaleDateString().toLowerCase().includes(word) ||
            statusMapping[item.status].toLowerCase().includes(word)
        );
    });

    return (
    <body>
        <div className="wrapper">
            <div className="sidebar">
                <button onClick={() => createInstruction()}>Створити доручення</button>
                <a className="menu-item" href='/instructions'><i className="bi bi-card-list"></i>Усі</a>
                <a className="menu-item" href='/instructions'><i className="bi bi-archive"></i>Архів</a>
            </div>

            <div className="main-content">
                <div className="filters">
                    <button className='filters-button'>Фільтри</button>
                    <input
                    type="text"
                    placeholder="Пошук за ключовими словами..."
                    className="me-2 input-search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Оновлюємо стан при введенні
                    />
                </div>

                <div className="content">
                    <Table responsive className="table table-hover">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Дата створення</th>
                                <th>Відповідальні</th>
                                <th>Джерело</th>
                                <th>Протокол засідання</th>
                                <th>Тип</th>
                                <th>Назва</th>
                                <th>Опис</th>
                                <th>Початок</th>
                                <th>Дедлайн</th>
                                <th>Статус</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            filteredData.map((instruction, index) => 
                                <tr key={instruction.id} onClick={() => handleRowClick(instruction.title)} style={{ cursor: 'pointer' }}>
                                <td>{index + 1}</td>
                                <td>{new Date(instruction.makingTime).toLocaleDateString()}</td>
                                <td>{instruction.heads}</td>
                                <td>{instruction.sourceOfInstruction}</td>
                                <td>{instruction.protocol}</td>
                                <td>{instruction.type}</td>
                                <td>{instruction.title}</td>
                                <td>{instruction.shortDescription}</td>
                                <td>{new Date(instruction.startTime).toLocaleDateString()}</td>
                                <td>{new Date(instruction.expTime).toLocaleDateString()}</td>
                                <td><span className={`status ${getStatusClass(statusMapping[instruction.status] || 'Невідомий статус')}`}>{statusMapping[instruction.status] || 'Невідомий статус'}</span></td>
                                <td><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></td>
                                <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                            </tr>)
                            }
                            {/* <tr onClick={() => handleRowClick(1)} style={{ cursor: 'pointer' }}>
                                <td><input type='checkbox'/></td>
                                <td>11.09.24</td>
                                <td>Адмін</td>
                                <td>Викладач</td>
                                <td>МОН</td>
                                <td>Науково-методична робота</td>
                                <td>Доручення 1</td>
                                <td>Зробити це</td>
                                <td>12.09.24</td>
                                <td>12.10.24</td>
                                <td><span className="status orange">Назначено</span></td>
                                <td><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></td>
                                <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                            </tr>
                            <tr>
                                <td><input type='checkbox'/></td>
                                <td>15.09.24</td>
                                <td>Адмін</td>
                                <td>Викладач2</td>
                                <td>AAA</td>
                                <td>Навчально-виховна робота</td>
                                <td>Доручення 2</td>
                                <td>Зробити те</td>
                                <td>16.09.24</td>
                                <td>10.10.24</td>
                                <td><span className="status yellow">В роботі</span></td>
                                <td><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></td>
                                <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                            </tr>
                            <tr>
                                <td><input type='checkbox'/></td>
                                <td>15.09.24</td>
                                <td>Адмін</td>
                                <td>Викладач3</td>
                                <td>ФБР</td>
                                <td>Профорієнтаційна робота</td>
                                <td>Доручення 3</td>
                                <td>Зробити пяте</td>
                                <td>16.11.24</td>
                                <td>10.12.24</td>
                                <td><span className="status green">Очікує затвердження</span></td>
                                <td><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></td>
                                <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                            </tr>
                            <tr>
                                <td><input type='checkbox'/></td>
                                <td>15.09.24</td>
                                <td>Адмін</td>
                                <td>Викладач4</td>
                                <td>ЦРУ</td>
                                <td>Навчально-організаційна робота</td>
                                <td>Доручення 4</td>
                                <td>Зробити десяте</td>
                                <td>16.10.24</td>
                                <td>10.11.24</td>
                                <td><span className="status grey">Затверджено</span></td>
                                <td><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></td>
                                <td><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></td>
                            </tr> */}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    </body>
    )
}

export default ListInstructionsComponent