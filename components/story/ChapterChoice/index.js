
import { useEffect } from 'react';
import { Link, Text, Spinner, Button } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import StoryNew from 'components/story/StoryNew';
import { FaAngleDown } from 'react-icons/fa';
import { getStoryUrl } from 'lib/helper/story';
import { ApiError, Like } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { TagList } from 'components/tag';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation } from 'swiper';
import { Avatar } from 'components/user';
import { formatDate, DATE_SHORT } from 'lib/helper/date';

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
          author {
            _id
            username
          }
          tags
          createdAt
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
  }, [!currentUser]);

  return (
    <div className={clsx('flex flex-col gap-md ', className)}>
      <ApiError error={error}/>
      <Spinner loading={loading}/>
      {!!data?.stories.edges.length && // chapter list
        <div className="flex flex-col gap-xs">
          <div className="flex flex-col items-center justify-center gap-xs">
            <Text variant="span" className="font-bold uppercase">What's next? </Text>
            <FaAngleDown className="text-3xl animate-bounce" />
          </div>
        </div>
      }

      <div className="flex flex-col md:flex-row gap-md">
        <div className="md:w-1/2 px-xl">
          {!!data?.stories.edges.length && 

            <div>
              <Text variant="h3" className="uppercase font-bold">Pick one</Text>
              <Swiper 
                className="w-full"
                modules={[EffectCards, Navigation]}
                effect="cards"
                navigation={true}
                onReachEnd={() => data?.stories.pageInfo.hasNextPage && fetchMore({ variables: { after: data?.stories.pageInfo.endCursor } })}
                >
                {data.stories.edges.map(({ node, index }) => (
                  <SwiperSlide key={node._id} virtualIndex={index} className="flex flex-col gap-md py-md px-xl justify-between rounded-xl bg-primary border-primary-contrast border-2 text-primary-contrast">
                    <div className="flex justify-between items-center">
                      <Text variant="span" className="text-sm">
                        {formatDate(node.createdAt, DATE_SHORT)}
                      </Text>
                      <Avatar className="justify-end" user={node.author} showName={true} />
                    </div>
                    <Link href={getStoryUrl(node)}>
                      <Text variant="chapterTitle" className="text-center block">{node.title}</Text>
                    </Link>
                    <div className="flex gap-md justify-between items-center">
                      <TagList tags={node.tags} />
                      <Like entity={node} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          }
          {!data.stories.edges.length &&
            <div className="text-center flex flex-col gap-xs">
              <Text variant="title" as="span" className="">The end...?</Text>
            </div>
          }
        </div>
        <StoryNew className="md:w-1/2" parent={parent} />
      </div>
    </div>
  );
};

export default ChapterChoice;

