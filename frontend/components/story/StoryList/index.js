import { useEffect } from 'react';
import { Link, Spinner, Text } from 'components/ui';
import { formatDate, DATE_SHORT, getStoryUrl, getStoryType } from 'lib/helper';
import { gql, useQuery } from '@apollo/client';
import { TagList } from 'components/tag';
import { Avatar } from 'components/user';
import { Like } from 'components/common';
import clsx from 'clsx';
import { useUser } from 'lib/auth';

/**
 * Story list query
 * @type {gql}
 */
export const QUERY_STORIES = gql`
  query stories($where: JSON) {
    stories(where: $where) {
      id
      title
      excerpt
      createdAt
      isRoot
      author {
        id
        username
      }
      tags {
        id
        label
        slug
      }
      likesCount
      userLike {
        id
      }
    }
  }
`;

const StoryList = ({ className, rootsOnly = true, author, tag }) => {

  const user = useUser();

  const { data, loading, error, refetch } = useQuery(QUERY_STORIES, {
    variables: {
      where: {
        author: author?.id,
        tags: tag?.id ? { id: tag.id } : undefined,
        isRoot: rootsOnly ? true : undefined,
      },
    },
  });

  // refresh data with customer specific infos
  useEffect(() => {
    if (user !== null) {
      refetch();
    }
  }, [user]);

  return (
    <div className={clsx('grid md:grid-cols-2 gap-md', className)}>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data?.stories && data.stories.map((story) => (
        <div key={story.id} className="rounded-xl p-md bg-primary text-primary-contrast flex flex-col gap-xs">

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
              <Link href={getStoryUrl(story)} underline={false}>{story.title}</Link>
            </Text>
            <Text variant="p">{story.excerpt}</Text>
            <Link href={getStoryUrl(story)}>Read more</Link>
          </div>

          <div className="flex justify-between items-center gap-md">
            <TagList className="flex-wrap my-xs md:my-sm" tags={story.tags} buttonVariant="primary-contrast" />
            <Like story={story} count={story.likesCount} userLike={story.userLike} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryList;

