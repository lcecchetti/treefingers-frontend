const PageIntro = ({ title, children }) => {
  return (
    <div className="mb-md lg:my-md flex flex-col gap-sm">
      {children}
    </div>
  );
};

export default PageIntro;