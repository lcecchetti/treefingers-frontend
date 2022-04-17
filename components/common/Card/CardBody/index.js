import clsx from 'clsx';

const CardBody = ({ className, children }) => {
  return (
    <div className={clsx('flex flex-col items-center gap-md grow', className)}>
      {children}
    </div>
  );
};

export default CardBody;