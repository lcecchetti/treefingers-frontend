import { Link, Button, Text } from 'components/ui';
import { Avatar } from 'components/user';
import clsx from 'clsx';
import { Card, CardBody, CardHeader } from 'components/common';
import { getUserUrl } from 'lib/helper/user';
import UserFollowership from '../UserFollowership';
import { getStoryUrl } from 'lib/helper/story';

const AuthorCard = ({ className, author }) => {
  console.log(author.stories.edges)
  return (
    <Card className={clsx('bg-primary text-primary-contrast', className)}>
      <CardHeader>
        <Avatar className="justify-end" user={author} showName={true} />
        <UserFollowership user={author} />
      </CardHeader>

      <CardBody>
        {!!author.stories.edges.length &&
          <ul className="w-full">
            {author.stories.edges.map(({ node }) => (
              <li key={node._id}><Link href={getStoryUrl(node)}>{node.title}</Link></li>
            ))}
          </ul>
        }
        <Button as={Link} href={getUserUrl(author)} variant="primary-contrast">View</Button>
      </CardBody>
    </Card>
  );
};

export default AuthorCard;

