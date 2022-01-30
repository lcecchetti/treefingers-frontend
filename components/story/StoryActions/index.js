import { CommentCount } from 'components/comment';
import { Like } from 'components/common';
import { useUI, flyoutTypes } from 'lib/ui/context';

const StoryActions = ({ story }) => {

  const { openFlyout } = useUI();

  return (
    <div className="flex items-center gap-sm">
      <CommentCount count={story.commentsCount} action={() => openFlyout(flyoutTypes.comments, { entity: story, title: 'Comments' })} />
      <Like entity={story} />
    </div>
  );
}

export default StoryActions;