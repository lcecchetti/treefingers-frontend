import { Link, Spinner, Text, Button } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { StoryNew } from 'components/story';
import merge from 'deepmerge';
import { getStoryUrl } from 'lib/helper';

/**
 * Chapter list query
 * @type {gql}
 */
export const QUERY_CHAPTERS = gql`
  query stories($where: JSON) {
    stories(where: $where) {
      id
      action
      root {
        id
      }
    }
  }
`;

const ChapterChoice = ({ className, parent }) => {

  const { data, loading, error } = useQuery(QUERY_CHAPTERS, { variables: {
    where: {
      parent: parent?.id,
    }
  }});

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

      <StoryNew parent={parent} root={parent?.root ?? parent} />
    </div>
  );
};

export default ChapterChoice;

