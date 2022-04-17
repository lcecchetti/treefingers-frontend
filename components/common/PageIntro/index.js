const PageIntro = ({ title, children }) => {
  return (
    <div className="my-md flex flex-col gap-sm">
      {children}
    </div>
  );
};

export default PageIntro;