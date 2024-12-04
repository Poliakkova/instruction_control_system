import React, {useEffect, useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ListInstructions.css';

import SideBarInstructionComponent from './panels/SideBarInstructionComponent';


const AccessDeniedComponent = () => {

    return (
    <body>
        <div className="wrapper">
            <div className="main-content" style={{width: '100%', overflowX: 'auto'}}>
                Сторінка недоступна
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
    </body>
    )
}

export default AccessDeniedComponent