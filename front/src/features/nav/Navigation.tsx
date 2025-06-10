import Logo from "./Logo";
import Container from "./Container";
import SearchBar from "./searchbar/SearchBar";
import UserMenu from "./UserMenu";

function Navigation() {

  return (
    <div id="nav-root" className="fixed w-full bg-white z-10 shadow-sm">
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