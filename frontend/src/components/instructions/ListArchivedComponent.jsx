import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../../css/ListInstructions.css'

import SideBarInstructionComponent from '../panels/SideBarInstructionComponent';
import InstructionTableComponent from './InstructionTableComponent';
import InstructionFiltersComponent from './InstructionFiltersComponent';
import { archivedInstructions, deleteInstruction } from '../../sevices/InstructionService';
import useFilters from './js/useFilters';
import { statusMapping, getStatusClass } from './js/statusUtils';
import LoginService from '../../sevices/LoginService';
import { getUserByLogin } from '../../sevices/UserService';


const ListArchivedComponent = () => {

    const isAdmin = LoginService.isAdmin();
    const isStudent = LoginService.isStudent();
    const isTeacher = LoginService.isTeacher();

    const navigator = useNavigate();
    
    const editInstruction = (code) => {
        navigator(`/instructions/edit/${encodeURIComponent(code)}`);
    };

    const handleRowClick = (code) => {
        navigator(`/instructions/${encodeURIComponent(code)}`);
    };

    const [instructions, setInstructions] = useState([])

    useEffect(() => {
        if(isAdmin || isStudent) {
            archivedInstructions(localStorage.getItem("token")).then((response) => {
                const sortedInstructions = response.data.sort((a, b) => {
                    return new Date(b.makingTime) - new Date(a.makingTime);
                });
                setInstructions(sortedInstructions);
            }).catch(error => {
                console.error(error);
            })
        } else if (isTeacher) {
            const fetchUser = async () => {
                try {
                    const userData = await getUserByLogin(localStorage.getItem("login"), localStorage.getItem("token"));
                    console.log('Дані користувача:', localStorage.getItem("login")); 

                    // Фільтруємо інструкції зі статусом FINISHED
                    const finishedInstructions = userData.instructions.filter(
                        (instruction) => instruction.status === "FINISHED"
                    );

                    setInstructions(finishedInstructions); // Оновлюємо стан з даними користувача
                } catch (error) {
                console.error('Error fetching instruction:', error);
                }
            }
            if (localStorage.getItem("login")) {
                fetchUser(); // Викликаємо функцію тільки якщо є логін
              }
        }

    }, [])
    
    const {
        filteredInstructions,
        searchTerm,
        availableTypes,
        availableStatuses,
        handleFilterChange,
        handleCheckboxChange,
        handleSearchChange,
    } = useFilters(instructions, statusMapping);

    return (
    <body>
        <div className="wrapper">
            <SideBarInstructionComponent />

            <div className="main-content" style={{width: '100%', overflowX: 'auto'}}>
            <div className="filters">
                    <InstructionFiltersComponent
                        handleFilterChange={handleFilterChange}
                        handleCheckboxChange={handleCheckboxChange}
                        availableTypes={availableTypes}
                        availableStatuses={availableStatuses}
                        searchTerm={searchTerm}
                        handleSearchChange={handleSearchChange}
                    />
                </div>

                <div className="content">
                    <InstructionTableComponent
                        filteredInstructions={filteredInstructions}
                        handleRowClick={handleRowClick}
                        editInstruction={editInstruction}
                        deleteInstruction={deleteInstruction}
                        statusMapping={statusMapping}
                        getStatusClass={getStatusClass}
                        navigator={navigator}
                    />
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    </body>
    )
}

export default ListArchivedComponent