import Logo from "./Logo";
// import SearchBar from "./searchbar/SearchBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar as BsNavbar, Container, Offcanvas, Nav, NavDropdown } from "react-bootstrap";
import { useState } from "react";

function Navigation() {
  const expand = false;

  return (
    <div className="flex flex-col justify-center h-48">
      <BsNavbar expand={expand} className="h-full bg-body-tertiary mb-3">
        <Container fluid className="flex items-center justify-between h-full">
          <BsNavbar.Brand className="flex items-center">
            <Logo />
          </BsNavbar.Brand>
          <BsNavbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <BsNavbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                <Logo />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/login">로그인</Nav.Link>
                <Nav.Link href="#action2">Link</Nav.Link>
                <NavDropdown
                  title="Dropdown"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                  <NavDropdown.Divider />
                </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </BsNavbar.Offcanvas>
        </Container>
      </BsNavbar>
    </div>
  );
}

export default Navigation