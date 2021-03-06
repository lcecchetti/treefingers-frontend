import { CommentCount } from 'components/comment';
import { Like } from 'components/common';
import { useUI } from 'lib/ui/context';

const StoryActions = ({ story }) => {

  const { openFlyout, flyoutTypes } = useUI();

  return (
    <div className="flex items-center gap-sm">
      <CommentCount count={story.commentsCount} action={() => openFlyout(flyoutTypes.comments, { story, title: 'Comments' })} />
      <Like entity={story} />
    </div>
  );
}

export default StoryActions;