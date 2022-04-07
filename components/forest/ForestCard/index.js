import clsx from 'clsx';
import { getForestUrl } from 'lib/helper/forest';
import { Text, Link, Button } from 'components/ui';
import ForestActions from 'components/forest/ForestActions';

const ForestCard = ({ className, forest }) => {
  return (
    <div className={clsx('text-primary-contrast bg-primary rounded-xl flex flex-col gap-md p-md justify-between', className)}>
      <div className="flex flex-col items-center px-lg grow gap-md">
        <Text variant="title">
          <Link href={getForestUrl(forest)}>{forest.name}</Link>
        </Text>
        <Text variant="p">{forest.excerpt}</Text>
        <Button as={Link} variant="primary-contrast" href={getForestUrl(forest)}>Read more</Button>
      </div>

      <ForestActions forest={forest} />
    </div>
  );
};

export default ForestCard;

