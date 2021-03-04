import { CommentCount } from 'components/comment';
import { Like } from 'components/common';

const StoryActions = ({ story, commentAction }) => {
  return (
    <div className="flex items-center gap-sm">
      {!!story.commentsCount &&
        <CommentCount count={story.commentsCount} action={commentAction} />
      }
      <Like story={story} count={story.likesCount} currentUserLike={story.currentUserLike} />
    </div>
  );
}

export default StoryActions;