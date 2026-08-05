import { Text, Button, Link } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { ForestActions } from '@/components/forest/forest-actions';
import { Pencil, Sprout } from 'lucide-react';
import { getStoryNewUrl } from '@/lib/helper/story';
import { graphql } from '@/lib/graphql/generated';
import type { ResultOf } from '@graphql-typed-document-node/core';

// Unlike ForestCard (fed a raw, masked query edge), callers here already
// unmask this fragment themselves, so ForestContent takes the plain result
// type instead of unmasking a second time.
export const ForestContent_ForestFragment = graphql(`
  fragment ForestContent_forest on Forest {
    id
    name
    about
    excerpt
    storiesCount
    commentsCount
    membersCount
    isEditable
    currentUserMembership {
      id
    }
  }
`);

interface ForestContentProps {
  forest: ResultOf<typeof ForestContent_ForestFragment>;
  onEdit?: () => void;
}

// Pure/hook-free so both the live ForestView (client) and forest/[name]'s
// static Server Component fallback can render it from one markup source.
export const ForestContent = ({ forest, onEdit }: ForestContentProps) => {
  return (
    <>
      <PageIntro>
        <div className="flex justify-between gap-sm flex-col md:flex-row md:items-center">
          <div className="flex gap-md justify-start items-center">
            <Text variant="pageTitle" className="break-words">{forest.name}</Text>
            {forest.isEditable && onEdit &&
              <Pencil className="w-5 h-5 cursor-pointer" onClick={onEdit} />
            }
          </div>

          <div className="flex gap-md justify-between">
            <Button as={Link} icon={Sprout} href={getStoryNewUrl(forest)}>Plant</Button>
            <ForestActions forest={forest} />
          </div>
        </div>
        <Text variant="p" className="whitespace-pre-wrap break-words w-full">{forest.about}</Text>
      </PageIntro>
      {forest.storiesCount === 0 &&
        <Text>I see too much blank space on this page, let's plant some stories!</Text>
      }
    </>
  );
};
