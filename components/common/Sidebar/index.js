import clsx from 'clsx';
import { PopularAuthors } from 'components/author';
import { PopularTags } from 'components/tag';

const Sidebar = ({ className }) => {
  return (
      <div className={clsx('flex flex-col gap-sm md:gap-md', className)}>
        <PopularAuthors />
        <PopularTags />
      </div>
  );
};

export default Sidebar;