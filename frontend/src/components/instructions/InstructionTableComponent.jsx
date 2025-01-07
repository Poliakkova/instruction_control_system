import React from 'react';
import { Table } from 'react-bootstrap';
import LoginService from '../../sevices/LoginService';

const InstructionTableComponent = ({
    filteredInstructions,
    handleRowClick,
    editInstruction,
    deleteInstruction,
    statusMapping,
    getStatusClass,
    navigator
}) => {
    const isAdmin = LoginService.isAdmin();
    const isHeadAdmin = LoginService.isHeadAdmin();
    const isTeacher = LoginService.isTeacher();

    return (
        <Table responsive className="table table-hover">
            <thead>
                <tr>
                    <th>Дата видачі доручення</th>
                    <th>Протокол засідання кафедри №</th>
                    <th>Джерело</th>
                    <th>Напрям</th>
                    <th style={{ minWidth: 150 }}>Виконавець</th>
                    <th style={{ minWidth: 200 }}>Назва</th>
                    <th style={{ minWidth: 200 }}>Опис</th>
                    <th>Кінцевий термін</th>
                    <th>Ознайомлений</th>
                    <th>Коли виконали</th>
                    <th className="sticky-col">Статус</th>
                    <th className="sticky-col"></th>
                    <th className="sticky-col"></th>
                </tr>
            </thead>
            <tbody>
                {filteredInstructions.length > 0 ? (
                    filteredInstructions.map((instruction) => (
                        <tr key={instruction.id} onClick={() => handleRowClick(instruction.code)} style={{ cursor: 'pointer' }}>
                            <td>{new Date(instruction.startTime).toLocaleDateString()}</td>
                            <td>{instruction.protocol}</td>
                            <td>{instruction.sourceOfInstruction}</td>
                            <td>{instruction.type}</td>
                            <td>
                                <div>
                                    {instruction.users.map((user, index) => (
                                        <p key={index} style={{ margin: 5 }}>
                                            {user.userSurname} {user.userName[0]}.{user.userPatronymic[0]}.
                                        </p>
                                    ))}
                                </div>
                            </td>
                            <td><div>{instruction.title}</div></td>
                            <td><div>{instruction.shortDescription}</div></td>
                            <td>{new Date(instruction.expTime).toLocaleDateString()}</td>
                            <td style={{fontSize:16, textAlign: 'center'}}>
                                {instruction.acquainted ? <i className="bi bi-check2-all"></i> 
                                : '?'}</td>
                            <td>{instruction.doneTime!=="1970-01-01T00:00:00.000+00:00" ? new Date(instruction.doneTime).toLocaleString() : null}</td>
                            <td className="sticky-col">
                                <span className={`status ${getStatusClass(statusMapping[instruction.status] || 'Невідомий статус')}`}>
                                    {statusMapping[instruction.status] || 'Невідомий статус'}
                                </span>
                            </td>
                            {(isAdmin && instruction.status==="CREATED") || isHeadAdmin ? <td className="sticky-col" style={{ padding: '10px 0' }}>
                                <i
                                    title="Редагувати"
                                    className="bi bi-pencil-square"
                                    style={{ fontSize: '18px', margin: 0 }}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        editInstruction(instruction.code);
                                    }}
                                ></i>
                            </td>
                            :<td className="sticky-col" style={{ padding: '10px 0' }}>
                            <i
                                title="Немає доступу"
                                className="bi bi-pencil-square"
                                style={{ fontSize: '18px', margin: 0, color: 'lightgray' }}
                            ></i>
                        </td>}

                            {(isAdmin && instruction.status==="CREATED") || isHeadAdmin ? <td className="sticky-col" style={{ padding: '10px 0' }}>
                                <i
                                    title="Видалити"
                                    className="bi bi-trash3"
                                    style={{ fontSize: '18px', margin: 0 }}
                                    onClick={() => deleteInstruction(instruction.code, navigator, localStorage.getItem("token"))}
                                ></i>
                            </td>
                            : <td className="sticky-col" style={{ padding: '10px 0' }}>
                            <i
                                title="Немає доступу"
                                className="bi bi-trash3"
                                style={{ fontSize: '18px', margin: 0, color: 'lightgray' }}
                            ></i>
                        </td>}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="12" style={{ textAlign: 'center' }}>
                            Немає доступних доручень
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default InstructionTableComponent;
