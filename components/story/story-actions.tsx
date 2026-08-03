'use client';

import clsx from 'clsx';
import { CommentCount } from '@/components/comment';
import { Like } from '@/components/common';
import { useUI, flyoutTypes } from '@/lib/ui/context';
import { FaTree } from 'react-icons/fa';
import type { StoryTreeStory } from '@/components/story/story-tree';

export interface StoryActionsStory extends Omit<StoryTreeStory, 'root'> {
  title: string;
  commentsCount: number;
  currentUserLike?: { id: string } | null;
  __typename: 'Story';
  root?: (StoryTreeStory & { title: string }) | null;
}

interface StoryActionsProps {
  story: StoryActionsStory;
  className?: string;
  disabledActions?: { tree?: boolean; comment?: boolean; like?: boolean };
}

export const StoryActions = ({ story, className, disabledActions = {} }: StoryActionsProps) => {

  const { openFlyout } = useUI();

  return (
    <div className={clsx('flex items-center gap-sm', className)}>
      {!disabledActions.tree &&
        <FaTree className="text-2xl cursor-pointer" onClick={() => openFlyout(flyoutTypes.tree, { entity: story, title: story.root ? story.root.title : story.title })} />
      }
      {!disabledActions.comment &&
        <CommentCount count={story.commentsCount} action={() => openFlyout(flyoutTypes.comments, { entity: story, title: 'Comments' })} />
      }
      {!disabledActions.like &&
        <Like entity={story} />
      }
    </div>
  );
}
