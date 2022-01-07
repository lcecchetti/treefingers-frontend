import { useEffect } from 'react';
import { Link, Spinner, Text } from 'components/ui';
import { formatDate, DATE_SHORT, getStoryUrl, getStoryType } from 'lib/helper';
import { gql, useQuery } from '@apollo/client';
import { TagList } from 'components/tag';
import { Avatar } from 'components/user';
import { StoryActions } from 'components/story';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import { ApiError } from 'components/common';

/**
 * Story list query
 * @type {gql}
 */
export const QUERY_STORIES = gql`
  query stories ($filter: StoryFilterInput) {
    stories (filter: $filter) {
      edges {
        node {
          _id
          title
          excerpt
          createdAt
          root {
            _id
          }
          author {
            _id
            email
          }
          tags {
            _id
            label
            slug
          }
          likesCount
          commentsCount
          currentUserLike {
            _id
          }
        }
      }
    }
  }
`;

const StoryList = ({ className, filter }) => {
  const currentUser = useCurrentUser();

  const { data, loading, error, refetch } = useQuery(QUERY_STORIES, {
    variables: { filter },
  });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser !== null) {
      refetch();
    }
  }, [currentUser]);

  return (
    <div className={clsx('grid md:grid-cols-2 gap-md', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {data?.stories && data.stories.edges.map(({ node }) => (
        <div key={node._id} className="rounded-xl p-md bg-primary text-primary-contrast flex flex-col gap-xs">

          <div className="flex justify-between items-center">
            <Text variant="span" className="text-sm">
              {formatDate(node.createdAt, DATE_SHORT)}
            </Text>
            <Text variant="span" className="font-bold">{getStoryType(node)}</Text>
            <Avatar className="justify-end" user={node.author} showName={true} />
          </div>

          <div>
            <Text variant="title">
              <Link href={getStoryUrl(node)}>{node.title}</Link>
            </Text>
            <Text variant="p">{node.excerpt}</Text>
            <Link href={getStoryUrl(node)}>Read more</Link>
          </div>

          <div className="flex justify-between items-center gap-md">
            <TagList className="flex-wrap my-xs md:my-sm" tags={node.tags} buttonVariant="primary-contrast" />
            <StoryActions story={node} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryList;

