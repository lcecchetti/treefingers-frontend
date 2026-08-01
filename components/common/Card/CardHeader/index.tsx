import clsx from 'clsx';

export interface CardHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const CardHeader = ({ className, children }: CardHeaderProps) => {
  return (
    <div className={clsx('flex justify-between items-center gap-md', className)}>
      {children}
    </div>
  );
};

export default CardHeader;
