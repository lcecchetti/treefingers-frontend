import clsx from "clsx";

const Container = ({ className, children }) => {

  return (
    <div className={clsx('lg:container mx-auto px-4', className)}>
      {children}
    </div>
  )
};

export default Container;

