import { Button, Link } from 'components/ui';
import { gql } from '@apollo/client';
import clsx from 'clsx';
import { getTagUrl } from 'lib/helper/tag';

/**
 * Tags list query
 * @type {gql}
 */
export const QUERY_TAGS = gql`
  query tags($filter: FilterTagInput) {
    tags(filter: $filter) {
      edges {
        node {
          _id
          label
          slug
        }
      }
    }
  }
`;

const TagList = ({ className, tags, buttonVariant = 'primary' }) => {
  if (!tags) {
    return '';
  }

  return (
    <ul className={clsx('flex gap-sm uppercase flex-wrap', className)}>
      {tags.map((tag) => (
        <li key={tag._id}>
          <Button variant={buttonVariant} as={Link} size="sm" href={getTagUrl(tag)}>{tag.label}</Button>
        </li>
      ))}
    </ul>
  );
}

export default TagList;