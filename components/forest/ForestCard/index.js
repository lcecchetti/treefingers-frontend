import { getForestUrl } from 'lib/helper/forest';
import { Text, Link, Button } from 'components/ui';
import ForestActions from 'components/forest/ForestActions';
import { Card, CardBody, CardFooter } from 'components/common';

const ForestCard = ({ className, forest }) => {
  return (
    <Card className={className}>
      <CardBody>
        <Text variant="title">
          <Link href={getForestUrl(forest)}>{forest.name}</Link>
        </Text>
        <Text variant="p">{forest.excerpt}</Text>
        <Button as={Link} variant="primary-contrast" href={getForestUrl(forest)}>Read more</Button>
      </CardBody>
      <CardFooter>
        <div></div>
        <ForestActions forest={forest} />
      </CardFooter>
    </Card>
  );
};

export default ForestCard;

