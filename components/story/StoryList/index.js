import { useEffect } from 'react';
import { Link, Spinner, Text } from 'components/ui';
import { formatDate, DATE_SHORT, getStoryUrl, getStoryType } from 'lib/helper';
import { gql, useQuery } from '@apollo/client';
import { TagList } from 'components/tag';
import { Avatar } from 'components/user';
import { StoryActions } from 'components/story';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Story list query
 * @type {gql}
 */
export const QUERY_STORIES = gql`
  query stories ($author: ID, $root) {
    stories (filter: { author: { eq: $author } }) {
      _id
      title
      excerpt
      createdAt
      isRoot
      author {
        _id
        username
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
`;

const StoryList = ({ className, rootsOnly = true, author, tag }) => {

  const currentUser = useCurrentUser();

  const { data, loading, error, refetch } = useQuery(QUERY_STORIES, {
    variables: {
      author: author?._id,
      root: rootsOnly ? true : undefined,
    },
  });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser !== null) {
      refetch();
    }
  }, [currentUser]);

  return (
    <div className={clsx('grid md:grid-cols-2 gap-md', className)}>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data?.stories && data.stories.map((story) => (
        <div key={story._id} className="rounded-xl p-md bg-primary text-primary-contrast flex flex-col gap-xs">

          <div className="flex justify-between items-center">
            <Text variant="span" className="text-sm">
              {formatDate(story.createdAt, DATE_SHORT)}
            </Text>
            {!rootsOnly &&
              <Text variant="span" className="font-bold">{getStoryType(story)}</Text>
            }
            <Avatar className="justify-end" user={story.author} showName={true} />
          </div>

          <div>
            <Text variant="title">
              <Link href={getStoryUrl(story)}>{story.title}</Link>
            </Text>
            <Text variant="p">{story.excerpt}</Text>
            <Link href={getStoryUrl(story)}>Read more</Link>
          </div>

          <div className="flex justify-between items-center gap-md">
            <TagList className="flex-wrap my-xs md:my-sm" tags={story.tags} buttonVariant="primary-contrast" />
            <StoryActions story={story} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryList;

