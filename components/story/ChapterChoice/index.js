import { useState, useEffect } from 'react';
import { Link, Spinner, Text, Button } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { StoryNew } from 'components/story';
import { FaAngleDown } from 'react-icons/fa';
import { getStoryUrl } from 'lib/helper';
import { FaTimes } from 'react-icons/fa';
import { ApiError, Like } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Chapter list query
 * @type {gql}
 */
export const QUERY_CHAPTERS = gql`
  query stories ($filter: StoryFilterInput) {
    stories (filter: $filter) {
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
        }
      }
    }
  }
`;

const ChapterChoice = ({ className, parent }) => {
  const currentUser = useCurrentUser();

  const [isWriting, setIsWriting] = useState(false);

  const { data, loading, error, refetch } = useQuery(QUERY_CHAPTERS, {
    variables: {
      filter: { parent: { eq: parent?._id } }
    }
  });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser !== null) {
      refetch();
    }
  }, [currentUser]);

  return (
    <div>
      {!isWriting && // chapter list section
        <div className={clsx('mx-auto max-w-screen-sm', className)}>
          <Spinner loading={loading}/>
          <ApiError error={error}/>

          {data &&
            <div className="flex flex-col gap-md">

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
                          <Like entity={node} viewOnly={true} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              }

              <div className="text-center flex flex-col gap-xs">
                {!data?.stories.edges.length &&
                  <Text variant="title" as="span" className="">The end...?</Text>
                }
                <Button className="w-full" onClick={() => setIsWriting(true)}>Write a new chapter</Button>
              </div>
            </div>
          }

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

