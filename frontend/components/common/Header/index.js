import { Container } from 'components/ui';
import { Logo } from 'components/common';
import Drawer from './Drawer';
import MainNavigation from './MainNavigation';
import IconList from './IconList';


const Header = () => {

  return (
    <>
      <div className="absolute w-full h-header bg-base">
        <Container>
          <div className="flex items-center justify-between my-md">
            <Logo main className="font-bold" />
            <MainNavigation />
            <IconList />
          </div>
        </Container>
      </div>
      <Drawer />
    </>
  );
};

export default Header;