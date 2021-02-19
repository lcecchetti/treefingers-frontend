import { Button, Link } from 'components/ui';
import { gql } from '@apollo/client';
import clsx from 'clsx';
import { getTagUrl } from 'lib/helper';

/**
 * Tags list query
 * @type {gql}
 */
export const QUERY_TAGS = gql`
  query tags($where: JSON) {
    tags(where: $where) {
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