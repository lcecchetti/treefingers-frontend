import clsx from 'clsx';

const Sidebar = ({ className }) => {
 
  return (
      <div className={clsx('flex flex-col gap-sm md:gap-md', className)}>
        SIDEBAR CONTENT
      </div>
  );
};

export default Sidebar;