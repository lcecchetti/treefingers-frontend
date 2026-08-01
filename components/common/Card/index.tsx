import clsx from 'clsx';

export { default as CardHeader } from './CardHeader';
export { default as CardFooter } from './CardFooter';
export { default as CardBody } from './CardBody';

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

const Card = ({ className, children }: CardProps) => {
  return (
    <div className={clsx('rounded-2xl p-lg flex flex-col gap-md justify-between', className)}>
      {children}
    </div>
  );
};

export default Card;
