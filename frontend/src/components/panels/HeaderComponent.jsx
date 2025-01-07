import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useAuth } from '../../AuthContext';
import LoginService from '../../sevices/LoginService';

const HeaderComponent = () => {
  const navigate = useNavigate();
  const isAuthenticatedFromService = LoginService.isAuthenticated();
  const isAdmin = LoginService.isAdmin();
  const isHeadAdmin = LoginService.isHeadAdmin();

  const [isNotification, setIsNotification] = useState(LoginService.isNotification());
  const userData = LoginService.getUserData();

  const { user, isAuthenticated, logout } = useAuth();

  const navigateSettings = (login) => {
    navigate(`/users/settings/${encodeURIComponent(login)}`);
  };

  const handleLogout = () => {
    const confirmDelete = window.confirm("Вийти з акаунта?");
    if (confirmDelete) {
      LoginService.logout();
      logout();
      navigate("/login");
      window.location.reload();
    }
    
  };

  return (
    <header className='header'>
          <Navbar variant="dark" bg="dark" expand="lg">
            <Container fluid style={{padding: "0 20px"}}>
              {isAuthenticatedFromService ? <Navbar.Brand href="/instructions"><span>D</span>оручення</Navbar.Brand>
              :<Navbar.Brand href='/login'><span>D</span>оручення вітає!</Navbar.Brand>}

              <Navbar.Toggle aria-controls="navbar-dark-example" />
              <Navbar.Collapse id="navbar-dark-example">
                <Nav className="me-auto">
                  {isAdmin || isHeadAdmin ? <Nav.Link href="/users">Користувачі</Nav.Link>:<></>}
                  {isAdmin || isHeadAdmin? <Nav.Link href="/statistics">Статистика</Nav.Link>:<></>}
                </Nav>

                {isAuthenticatedFromService ? <Nav>
                  <NavDropdown
                    id="nav-dropdown-dark-example"
                    title={localStorage.getItem("login")}
                    // title={user.email}
                    menuVariant="dark">
                    <NavDropdown.Item onClick={() => navigateSettings(userData.login)}>Налаштування</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>Вийти</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                :<Nav>
                  <Nav.Link href='/login'>Увійти</Nav.Link>
                </Nav>}
                
              </Navbar.Collapse>
            </Container>
          </Navbar>
        
        </header>
  )
};

export default HeaderComponent;