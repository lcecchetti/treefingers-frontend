import { getForestUrl } from 'lib/helper/forest';
import { Text, Link, Button } from 'components/ui';
import ForestActions from 'components/forest/ForestActions';
import { Card, CardBody, CardFooter } from 'components/common';
import clsx from 'clsx';

const ForestCard = ({ className, forest }) => {
  return (
    <Card className={clsx('border-2 bg-base', className)}>
      <CardBody>
        <Text variant="title">{forest.name}</Text>
        <Text variant="p" className="whitespace-pre-wrap">{forest.excerpt}</Text>
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

