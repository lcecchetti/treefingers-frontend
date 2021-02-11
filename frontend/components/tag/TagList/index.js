import { Button, Link } from 'components/ui';
import { getTagUrl } from 'lib/helper/tag';
import { gql } from '@apollo/client';
import clsx from 'clsx';

/**
 * Tags list query
 * @type {gql}
 */
export const QUERY_TAGS = gql`
  query tags($story: ID) {
    tags(where: { stories: $story }) {
      id
      label
      slug
    }
  }
`;

const TagList = ({ className, tags, buttonVariant = 'primary' }) => {
  
  return (
    <ul className={clsx('flex gap-sm uppercase', className)}>
      {tags.map((tag) => (
        <li key={tag.id}>
          <Button variant={buttonVariant} as={Link} size="sm" styleAsLink={false} href={getTagUrl(tag)}>{tag.label}</Button>
        </li>
      ))}
    </ul>
  );
}

export default TagList;