import { Container } from 'components/ui';
import { Logo } from 'components/common';
import Drawer from './Drawer';
import { SearchBar } from 'components/search';
import MainNavigation from './MainNavigation';
import IconList from './IconList';


const Header = () => {

  return (
    <>
      <div className="fixed md:absolute w-full h-header bg-base flex items-center z-20">
        <Container>
          <div className="flex items-center justify-between my-md">
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