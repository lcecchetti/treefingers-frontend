import { Text, Button, Link } from '@/components/ui';
import { Avatar } from '@/components/user';
import { StoryActions } from '@/components/story/story-actions';
import { TagList } from '@/components/tag';
import { ChevronUp, ChevronsUp, Pencil } from 'lucide-react';
import { getStoryUrl, isStoryRoot } from '@/lib/helper/story';
import { getForestUrl } from '@/lib/helper/forest';
import { graphql } from '@/lib/graphql/generated';
import type { ResultOf } from '@graphql-typed-document-node/core';

// colocated with the component that owns it, per Apollo's fragment
// guidance. Unlike StoryCard (fed a raw, still-masked query edge by list
// components), StoryView and story/[id]/page.tsx both already have to
// unmask this fragment themselves to read several of these fields directly
// (createdAt, the StoryTreeStory-shaped fields, title/excerpt for
// metadata) - so StoryContent just takes the already-unmasked, plain
// result type instead of unmasking a second time
export const StoryContent_StoryFragment = graphql(`
  fragment StoryContent_story on Story {
    __typename
    id
    title
    content
    excerpt
    createdAt
    author {
      id
      username
    }
    tags
    parent {
      id
    }
    root {
      id
      title
      likesCount
      descendantsCount
      childrenCount
      commentsCount
      depth
    }
    forest {
      id
      name
    }
    likesCount
    commentsCount
    descendantsCount
    childrenCount
    depth
    currentUserLike {
      id
    }
    isEditable
  }
`);

interface StoryContentProps {
  story: ResultOf<typeof StoryContent_StoryFragment>;
  createdAt: string;
  onEdit?: () => void;
}

// pure/hook-free so it can be rendered from either the live, personalized
// StoryView (client) or a Server Component's static fallback (story/[id]
// page) using the already-fetched public story data - one markup source, no
// risk of the two drifting apart. `createdAt` is passed in pre-formatted
// since date formatting itself needs a client/server-specific strategy (see
// useFormattedDate vs formatDate in lib/helper/date.ts)
export const StoryContent = ({ story, createdAt, onEdit }: StoryContentProps) => {
  return (
    <>
      <div className="text-center flex justify-around items-center">
        {!isStoryRoot(story) &&
          <>
            <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(story.parent!)} icon={ChevronUp}>Prev chapter</Button>
            <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(story.root!)} icon={ChevronsUp}>Back to root</Button>
          </>
        }
        {story.forest &&
          <Button as={Link} variant="outlined" size="sm" href={getForestUrl(story.forest)} icon={ChevronsUp}>Back to forest</Button>
        }
      </div>

      <div className="flex flex-col gap-md">
        <div className="flex justify-between items-center">
          <Text variant="span">{createdAt}</Text>
          <Avatar user={story.author} showName={true} />
        </div>

        <div className="flex gap-md justify-start items-center">
          <Text variant="storyTitle" className="break-words">{story.title}</Text>
          {story.isEditable && onEdit &&
            <Pencil className="w-5 h-5 cursor-pointer" onClick={onEdit} />
          }
        </div>
        <Text variant="p" className="whitespace-pre-wrap break-words w-full">{story.content}</Text>

        <div className="flex justify-between items-center">
          <TagList tags={story.tags} />
          <StoryActions className="lg:hidden" story={story} />
          <StoryActions className="hidden lg:flex" story={story} disabledActions={{ tree: true }} />
        </div>
      </div>
    </>
  );
};
