import clsx from 'clsx';
import { gql } from '@apollo/client';
import { getForestUrl } from 'lib/helper/forest';
import { Text, Link } from 'components/ui';
import ForestActions from 'components/forest/ForestActions';

const ForestCard = ({ className, forest }) => {
  return (
    <div className={clsx('text-primary-contrast bg-primary rounded-xl flex flex-col p-md', className)}>
      <div>
        <Text variant="title">
          <Link href={getForestUrl(forest)}>{forest.name}</Link>
        </Text>
        <Text variant="p">{forest.excerpt}</Text>
        <Link href={getForestUrl(forest)}>Read more</Link>
      </div>

      <ForestActions forest={forest} />
    </div>
  );
};

export default ForestCard;

