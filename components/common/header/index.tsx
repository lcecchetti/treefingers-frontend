import { Suspense } from 'react';
import { Container } from '@/components/ui';
import { Logo } from '@/components/common';
import { Drawer } from './drawer';
import { SearchBar } from '@/components/search';
import { MainNavigation } from './main-navigation';
import { IconList } from './icon-list';


export const Header = () => {

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
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
      <Drawer />
    </>
  );
};
