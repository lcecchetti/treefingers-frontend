import { Button, Link } from 'components/ui';
import { getTagUrl } from 'lib/helper/tag';
import { gql } from '@apollo/client';

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

const TagList = ({ tags }) => {
  
  return (
    <ul className="my-sm flex gap-sm uppercase">
      {tags.map((tag) => (
        <li key={tag.id}>
          <Button as={Link} size="sm" styleAsLink={false} href={getTagUrl(tag)}>{tag.label}</Button>
        </li>
      ))}
    </ul>
  );
}

export default TagList;