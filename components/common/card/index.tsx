import clsx from 'clsx';

export { CardHeader } from './card-header';
export { CardFooter } from './card-footer';
export { CardBody } from './card-body';

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div className={clsx('rounded-2xl p-lg flex flex-col gap-md justify-between', className)}>
      {children}
    </div>
  );
};
