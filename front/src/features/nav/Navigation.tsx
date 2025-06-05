import Logo from "./Logo";
// import SearchBar from "./searchbar/SearchBar";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Navbar as BsNavbar, Container, Offcanvas, Nav, NavDropdown, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom";
import Container from "./Container";
import SearchBar from "./searchbar/SearchBar";
import UserMenu from "./UserMenu";


function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const { user, isLoggedIn, isAdmin, isUser, logout } = useAuth();

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div
        className="
          py-4
          border-b-[1px]
          ">
            <Container>
              <div
                className="
                  flex
                  flex-row
                  items-center
                  justify-between
                  gap-3
                  md:gap-0
                ">
                  <Logo />
                  <SearchBar />
                  <UserMenu />
              </div>
            </Container>
      </div>
    </div>
  );
}

export default Navigation

    // <div className="flex flex-col justify-center h-48">
    //   <BsNavbar expand={expand} className="h-full bg-body-tertiary mb-3">
    //     <Container fluid className="flex items-center justify-between h-full">
    //       <BsNavbar.Brand className="flex items-center">
    //         <Logo />
    //       </BsNavbar.Brand>
    //       <BsNavbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
    //       <BsNavbar.Offcanvas
    //         id={`offcanvasNavbar-expand-${expand}`}
    //         aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
    //         placement="end"
    //       >
    //         <Offcanvas.Header>
    //           <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
    //             <Logo />
    //           </Offcanvas.Title>
    //         </Offcanvas.Header>
    //         <Offcanvas.Body>
    //           <Nav className="justify-content-end flex-grow-1 pe-3">
    //             {isLoggedIn ? (
    //               <>
    //                 <Nav.Link href="/mypage">마이페이지</Nav.Link>
    //                 <Button onClick={handleLogout}>로그아웃</Button>
    //               </>
    //             ) : (
    //               <Nav.Link href="/login">로그인</Nav.Link>
    //             )}
    //             <Nav.Link href="#action2">Link</Nav.Link>
    //             <NavDropdown
    //               title="Dropdown"
    //               id={`offcanvasNavbarDropdown-expand-${expand}`}
    //             >
    //               <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
    //               <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
    //               <NavDropdown.Divider />
    //             </NavDropdown>
    //           </Nav>
    //         </Offcanvas.Body>
    //       </BsNavbar.Offcanvas>
    //     </Container>
    //   </BsNavbar>
    // </div>