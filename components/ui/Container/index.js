import clsx from 'clsx';

const Container = ({ className, children, fluid }) => {

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

