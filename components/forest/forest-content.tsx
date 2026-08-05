import { Text, Button, Link } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { ForestActions } from '@/components/forest/forest-actions';
import { Pencil, Sprout } from 'lucide-react';
import { getStoryNewUrl } from '@/lib/helper/story';
import { graphql } from '@/lib/graphql/generated';
import type { ResultOf } from '@graphql-typed-document-node/core';

// colocated with the component that owns it, per Apollo's fragment
// guidance. Unlike ForestCard (fed a raw, still-masked query edge by list
// components), every caller of ForestContent already has to unmask this
// fragment itself to read its own fields directly (ForestView needs
// forest.id, forest/[name]/page.tsx needs forest.name/.excerpt for
// metadata) - so ForestContent just takes the already-unmasked, plain
// result type instead of unmasking a second time
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

// pure/hook-free so it can be rendered from either the live, personalized
// ForestView (client) or a Server Component's static fallback (forest/[name]
// page) using the already-fetched public forest data - one markup source,
// no risk of the two drifting apart
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
