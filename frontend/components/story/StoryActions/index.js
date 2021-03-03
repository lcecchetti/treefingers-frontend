import { CommentCount } from 'components/comment';
import { Like } from 'components/common';

const StoryActions = ({ story }) => {
  return (
    <div className="flex items-center gap-sm">
      {!!story.commentsCount &&
        <CommentCount count={story.commentsCount} />
      }
      <Like story={story} count={story.likesCount} currentUserLike={story.currentUserLike} />
    </div>
  );
}

export default StoryActions;