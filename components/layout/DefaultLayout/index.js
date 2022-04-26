const DefaultLayout = ({ children }) => {

  return (
    <div className="pt-header min-h-screen">
      <div className="my-md lg:my-0">
        {children}
      </div>
    </div>
  )
};

export default DefaultLayout;