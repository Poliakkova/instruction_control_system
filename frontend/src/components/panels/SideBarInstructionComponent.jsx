import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import '../../css/SideBar.css';
import LoginService from '../../sevices/LoginService';

const SideBarInstructionComponent = () => {

    const isAdmin = LoginService.isAdmin();

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true); // Стан для контролю видимості панелі

    function createInstruction(){
        navigate('/instructions/new');
    };

    function toggleSidebar() {
        setIsOpen(!isOpen); // Змінює стан на протилежний для відкриття/закриття
    }

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                {isAdmin && <button onClick={() => createInstruction()}>Створити доручення</button>}
                <a className="menu-item" href='/instructions'><i className="bi bi-card-list"></i>Усі</a>
                <a className="menu-item" href='/instructions/archived'><i className="bi bi-archive"></i>Архів</a>
            </div>
            <button onClick={toggleSidebar} className="toggle-sidebar-btn">
                    {isOpen ? <i className="bi bi-arrow-bar-left"></i> : <i className="bi bi-arrow-bar-right"></i>}
            </button>
        </>
    )
};

export default SideBarInstructionComponent;