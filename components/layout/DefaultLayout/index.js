const DefaultLayout = ({ children }) => {

  return (
    <div className="pt-header min-h-screen">
      <div className="mt-md lg:mt-0">
        {children}
      </div>
    </div>
  )
};

export default DefaultLayout;