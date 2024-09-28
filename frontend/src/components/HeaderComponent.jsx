import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const HeaderComponent = () => {
  return (
    <header className='header'>
          <Navbar variant="dark" bg="dark" expand="lg">
            <Container fluid>
              <Navbar.Brand href="/instructions"><span>D</span>оручення</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbar-dark-example" />
              <Navbar.Collapse id="navbar-dark-example">
                <Nav className="me-auto">
                  <Nav.Link href="/users">Користувачі</Nav.Link>
                  <Form className="d-flex search-form">
                    <Form.Control
                      type="search"
                      placeholder="Введіть назву..."
                      className="me-2"
                      aria-label="Search"
                      style={{
                        width: "300px",
                        border: "2px solid #535353",
                        background: "#1a1a1a",
                        color: "white"}}
                    />
                    <Button bsPrefix="custom" variant='dark'>Пошук</Button>
                  </Form>
                </Nav>
                <Nav>
                  <NavDropdown
                    id="nav-dropdown-dark-example"
                    title="email@gmail.com"
                    menuVariant="dark">
                    <NavDropdown.Item href="#action/3.1">Налаштування</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Вийти</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                
              </Navbar.Collapse>
            </Container>
          </Navbar>
        
        </header>
  )
}

export default HeaderComponent