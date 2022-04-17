import clsx from 'clsx';

const CardFooter = ({ className, children }) => {
  return (
    <div className={clsx('flex justify-between items-center gap-md', className)}>
      {children}
    </div>
  );
};

export default CardFooter;