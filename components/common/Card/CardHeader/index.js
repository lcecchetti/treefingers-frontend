import clsx from 'clsx';

const CardHeader = ({ className, children }) => {
  return (
    <div className={clsx('flex justify-between items-center gap-md', className)}>
      {children}
    </div>
  );
};

export default CardHeader;