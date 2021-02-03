import clsx from 'clsx';

const Container = ({ className, children, fluid }) => {

  return (
    <div className={clsx(
      { ['lg:container']: !fluid },
      'mx-auto px-md',
      className
    )}>
      {children}
    </div>
  );
};

export default Container;

