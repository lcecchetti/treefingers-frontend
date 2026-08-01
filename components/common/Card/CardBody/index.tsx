import clsx from 'clsx';

export interface CardBodyProps {
  className?: string;
  children?: React.ReactNode;
}

const CardBody = ({ className, children }: CardBodyProps) => {
  return (
    <div className={clsx('flex flex-col items-center gap-md grow', className)}>
      {children}
    </div>
  );
};

export default CardBody;
