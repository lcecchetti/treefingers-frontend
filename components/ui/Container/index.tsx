import clsx from 'clsx';

export interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
  fluid?: boolean;
}

const Container = ({ className, children, fluid }: ContainerProps) => {

  return (
    <div className={clsx(
      { ['lg:container']: !fluid },
      'mx-auto px-md w-full',
      className
    )}>
      {children}
    </div>
  );
};

export default Container;

