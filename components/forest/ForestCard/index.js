import { getForestUrl } from 'lib/helper/forest';
import { Text, Link, Button } from 'components/ui';
import ForestActions from 'components/forest/ForestActions';
import { Card, CardBody, CardFooter } from 'components/common';
import clsx from 'clsx';

const ForestCard = ({ className, forest }) => {
  return (
    <Card className={clsx('border-2 bg-base', className)}>
      <CardBody>
        <Link href={getForestUrl(forest)} className="w-full">
          <Text variant="title" className="break-words text-center">{forest.name}</Text>
        </Link>
        <Text variant="p" className="break-words w-full text-center">{forest.excerpt}</Text>
        <Button as={Link} variant="primary" href={getForestUrl(forest)}>Read more</Button>
      </CardBody>
      <CardFooter>
        <div></div>
        <ForestActions forest={forest} />
      </CardFooter>
    </Card>
  );
};

export default ForestCard;

