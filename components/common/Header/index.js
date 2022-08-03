import { Container } from 'components/ui';
import { Logo } from 'components/common';
import Drawer from './Drawer';
import { SearchBar } from 'components/search';
import MainNavigation from './MainNavigation';
import IconList from './IconList';


const Header = () => {

  return (
    <>
      <div id="header" className="fixed lg:absolute w-full h-header bg-base lg:bg-transparent flex items-center z-20 py-sm">
        <Container>
          <div className="flex items-center justify-between">
            <Logo main className="font-bold" />
            <MainNavigation />
            <IconList />
          </div>
        </Container>
        <SearchBar />
      </div>
      <Drawer />
    </>
  );
};

export default Header;