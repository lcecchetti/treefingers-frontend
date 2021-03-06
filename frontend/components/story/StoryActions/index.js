import { CommentCount } from 'components/comment';
import { Like } from 'components/common';

const StoryActions = ({ story, commentAction }) => {
  return (
    <div className="flex items-center gap-sm">
      {(!!story.commentsCount || commentAction) &&
        <CommentCount count={story.commentsCount} action={commentAction} />
      }
      <Like entity={story} />
    </div>
  );
}

export default StoryActions;