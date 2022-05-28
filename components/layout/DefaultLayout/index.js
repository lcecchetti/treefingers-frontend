import { Header, Footer } from 'components/common';

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Header/>
      <div className="pt-header min-h-screen">
        {children}
      </div>
      <Footer/>
    </>
  )
};

export default DefaultLayout;