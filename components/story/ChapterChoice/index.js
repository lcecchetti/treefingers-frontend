import { useState, useEffect } from 'react';
import { Link, Text, Button } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { StoryNew } from 'components/story';
import { FaAngleDown } from 'react-icons/fa';
import { getStoryUrl } from 'lib/helper/story';
import { FaTimes } from 'react-icons/fa';
import { InfiniteScroll, Like } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { TagList } from 'components/tag';

/**
 * Chapter list query
 * @type {gql}
 */
export const QUERY_CHAPTERS = gql`
  query stories($filter: FilterStoryInput, $first: Int, $after: String) {
    stories (filter: $filter, first: $first, after: $after) {
      edges {
        node {
          _id
          title
          root {
            _id
          }
          likesCount
          currentUserLike {
            _id
          }
          tags
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const ChapterChoice = ({ className, parent, first = 10 }) => {
  const currentUser = useCurrentUser();

  const [isWriting, setIsWriting] = useState(false);

  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_CHAPTERS, {
    variables: {
      filter: { parent: { eq: parent._id } },
      first,
    }
  });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
    setIsWriting(false);
  }, [!currentUser]);

  return (
    <div>
      {!isWriting && // chapter list section
        <div className={clsx('mx-auto max-w-screen-sm flex flex-col gap-md', className)}>
          <InfiniteScroll loading={loading} error={error} onLoadMore={() => fetchMore({ variables: { after: data?.stories.pageInfo.endCursor } })} hasMore={data?.stories.pageInfo.hasNextPage}>
            {!!data?.stories.edges.length && // chapter list
              <div className="flex flex-col gap-xs">
                <div className="flex flex-col items-center justify-center gap-xs">
                  <Text variant="span" className="font-bold uppercase">What's next? </Text>
                  <FaAngleDown className="text-3xl animate-bounce" />
                </div>
                <ul className="flex flex-col border-2 rounded-xl overflow-hidden gap-px bg-primary">
                  {data.stories.edges.map(({ node }) => (
                    <li key={node._id} className="bg-base">
                      <Link href={getStoryUrl(node)} className="p-md flex gap-md items-center justify-between">
                        <Text variant="span">{node.title}</Text>
                        <div className="flex gap-sm items-center">
                          <TagList tags={node.tags} />
                          <Like entity={node} viewOnly={true} />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            }
          </InfiniteScroll>
          <div className="text-center flex flex-col gap-xs">
            {!data?.stories.edges.length &&
              <Text variant="title" as="span" className="">The end...?</Text>
            }
            <Button className="w-full" onClick={() => setIsWriting(true)}>Write a new chapter</Button>
          </div>
        </div>
      }

      {isWriting && // writing section
        <div className="relative pt-md">
          <div className="flex gap-xs justify-between items-center mb-sm">
            <Text variant="h3" as="span" className="uppercase font-bold">What's next?</Text>
            <FaTimes className="text-2xl cursor-pointer" onClick={() => setIsWriting(false)} />
          </div>
          <StoryNew parent={parent} />
        </div>  
      }
    </div>
  );
};

export default ChapterChoice;

