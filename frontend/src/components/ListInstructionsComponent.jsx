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

    const handleRowClick = (id) => {
        // Перехід на сторінку деталей з ідентифікатором
        navigator(`/instructions/instruction`);
      };

  return (
    // <div className='container'>
    //     <h2 className='text-center'>Усі доручення</h2>
    //     <button className='btn btn-primary mb-2' onClick={createInstruction}>Створити доручення</button>
    //     <table className='table table-striped table-bordered'>
    //         <thead>
    //             <tr>
    //                 <td>id</td>
    //                 <td>title</td>
    //                 <td>head</td>
    //                 <td>headControl</td>
    //                 <td>status</td>
    //                 <td>sourceOfInstruction</td>
    //                 <td>shortDescription</td>
    //                 <td>startTime</td>
    //                 <td>expTime</td>
    //                 <td></td>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {
    //                 instructions.map(instruction => 
    //                 <tr key={instruction.id}>
    //                     <td>{instruction.id}</td>
    //                     <td>{instruction.title}</td>
    //                     <td>{instruction.headSurname} {instruction.headName} {instruction.headPatronymic}</td>
    //                     <td>{instruction.headControl} {instruction.headControlName} {instruction.headControlPatronymic}</td>
    //                     <td>{instruction.status}</td>
    //                     <td>{instruction.sourceOfInstruction}</td>
    //                     <td>{instruction.shortDescription}</td>
    //                     <td>{instruction.startTime}</td>
    //                     <td>{instruction.expTime}</td>
    //                 </tr>)
    //             }
    //         </tbody>
    //     </table>
    // </div>
    <body>
    <div className="wrapper">
        <div className="sidebar">
            <button onClick={() => createInstruction()}>Створити доручення</button>
            <a className="menu-item" href='/instructions'><i class="bi bi-card-list"></i>Усі</a>
            <a className="menu-item" href='/instructions'><i class="bi bi-archive"></i>Архів</a>
        </div>

        <div className="main-content">
            <div className="filters">
                <button className='filters-button'>Фільтри</button>
            </div>

            <div className="content">
                <Table responsive className="table table-hover">
                    <thead>
                        <tr>
                            <th><input type='checkbox'/></th>
                            <th onclick={() => sortTable(0)}>Дата</th>
                            <th onclick={() => sortTable(1)}>Відповідальний</th>
                            <th onclick={() => sortTable(2)}>Керуючий процесом</th>
                            <th onclick={() => sortTable(3)}>Джерело</th>
                            <th onclick={() => sortTable(3)}>Тип</th>
                            <th onclick={() => sortTable(4)}>Назва</th>
                            <th onclick={() => sortTable(5)}>Опис</th>
                            <th onclick={() => sortTable(6)}>Початок</th>
                            <th onclick={() => sortTable(7)}>Дедлайн</th>
                            <th onclick={() => sortTable(8)}>Статус</th>
                            <th onclick={() => sortTable(8)}></th>
                            <th onclick={() => sortTable(8)}></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onClick={() => handleRowClick(1)} style={{ cursor: 'pointer' }}>
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
                        </tr>
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