import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const SideBarUserComponent = () => {

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true); // Стан для контролю видимості панелі

    function createUser(){
        navigate('/users/new')
    }

    function toggleSidebar() {
        setIsOpen(!isOpen); // Змінює стан на протилежний для відкриття/закриття
    }

    return (
        <>
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button onClick={() => createUser()}>Додати користувача</button>
        </div>
        <button onClick={toggleSidebar} className="toggle-sidebar-btn">
            {isOpen ? <i className="bi bi-arrow-bar-left"></i> : <i className="bi bi-arrow-bar-right"></i>}
        </button>
        </>
    )
};

export default SideBarUserComponent;