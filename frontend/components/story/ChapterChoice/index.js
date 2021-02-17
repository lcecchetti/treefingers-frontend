import { Link, Spinner, Text, Button } from 'components/ui';
import { getStoryUrl } from 'lib/helper/story';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { StoryNew } from 'components/story';
import merge from 'deepmerge';

/**
 * Chapter list query
 * @type {gql}
 */
export const QUERY_CHAPTERS = gql`
  query stories($where: JSON) {
    stories(where: $where) {
      id
      action
      slug
      root {
        id
        slug
      }
      parent {
        id
      }
    }
  }
`;

/**
 * Default query variables
 * @type {Object}
 */
export const defaultQueryChaptersVariables = {};

const ChapterChoice = ({ className, parent }) => {

  const queryVariables = {
    where: {
      parent: parent?.id,
    }
  };

  const { data, loading, error } = useQuery(QUERY_CHAPTERS, { variables: merge(defaultQueryChaptersVariables, queryVariables) });

  return (
    <div className={clsx('mx-auto max-w-screen-sm', className)}>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {!!data?.stories.length &&
        <div>
          <Text variant="h3" className="font-bold mb-sm">What's next?</Text>
          <ul className="flex flex-col border-2 rounded-xl overflow-hidden gap-px bg-primary">
            {data.stories.map((chapter) => (
              <li key={chapter.id} className="p-sm bg-base">
                <Link href={getStoryUrl(chapter)} underline={false} className="block">{chapter.action}</Link>
              </li>
            ))}
          </ul>
        </div>
      }

      {!loading &&
        <div className="mt-md text-center">
          <Text variant="title" as="span" className="">The end...?</Text>
          <Button as={Link} styleAsLink={false} className="w-full mt-sm">Write a new chapter</Button>
        </div>
      }

      <StoryNew parent={story} root={story.root ?? story} />
    </div>
  );
};

export default ChapterChoice;

