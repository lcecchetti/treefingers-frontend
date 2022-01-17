import clsx from 'clsx';
import PopularAuthors from 'components/author/PopularAuthors';

const Sidebar = ({ className }) => {
  return (
      <div className={clsx('flex flex-col gap-sm md:gap-md', className)}>
        <PopularAuthors />
      </div>
  );
};

export default Sidebar;