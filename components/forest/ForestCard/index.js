import clsx from 'clsx';
import { Like } from 'components/common';
import { gql } from '@apollo/client';
import { getForestUrl } from 'lib/helper/forest';
import { Text, Link } from 'components/ui';

/**
 * Forest card fields
 * @type gql
 */
 export const FRAGMENT_FOREST_CARD_FIELDS = gql`
  fragment ForestCardFields on Forest {
    _id
    name
    slug
    excerpt
    currentUserLike {
      _id
    }
    likesCount
  }
`;

const ForestCard = ({ className, forest }) => {
  return (
    <div className={clsx('text-primary-contrast bg-primary rounded-xl flex flex-col p-md', className)}>
      <div className="flex justify-between items-center">
        <Text variant="h3"><Link href={getForestUrl(forest)}>{forest.name}</Link></Text>
      </div>

      <div>
        <Text variant="title">
          <Link href={getForestUrl(forest)}>{forest.name}</Link>
        </Text>
        <Text variant="p">{forest.excerpt}</Text>
        <Link href={getForestUrl(forest)}>Read more</Link>
      </div>

      <div className="flex justify-end items-center gap-md">
        <Like entity={forest} />
      </div>
    </div>
  );
};

export default ForestCard;

