const PageIntro = ({ title, children }) => {
  return (
    <div className="mb-md md:my-md flex flex-col gap-sm">
      {children}
    </div>
  );
};

export default PageIntro;