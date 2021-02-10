import { Button, Link } from 'components/ui';
import { getTagUrl } from 'lib/helper/tag';
import { gql } from '@apollo/client';

/**
 * Tag list fields fragment
 * @type {gql}
 */
const FRAGMENT_TAGS = gql`
  fragment TagsFields on Tag {
    id
    label
    slug
  }
`;

/**
 * Tags list query
 * @type {gql}
 */
export const QUERY_TAGS = gql`
  query tags($story: ID) {
    tags(where: { stories: $story }) {
      ...TagsFields
    }
  }
  ${FRAGMENT_TAGS}
`;

const TagList = ({ tags }) => {
  if (!tags || !tags.length) {
    return <></>;
  }

  return (
    <ul className="my-sm flex gap-sm uppercase">
      {tags.map((tag, index) => (
        <li key={index}>
          <Button as={Link} size="sm" styleAsLink={false} href={getTagUrl(tag)}>{tag.label}</Button>
        </li>
      ))}
    </ul>
  );
}

export default TagList;