import clsx from 'clsx';
import { CommentCount } from 'components/comment';
import { Like } from 'components/common';
import { useUI, flyoutTypes } from 'lib/ui/context';
import { FaTree } from 'react-icons/fa';

const StoryActions = ({ story, className, disabledActions = {} }) => {

  const { openFlyout } = useUI();

  return (
    <div className={clsx('flex items-center gap-sm', className)}>
      {!disabledActions.tree &&
        <FaTree className="text-2xl cursor-pointer" onClick={() => openFlyout(flyoutTypes.tree, { entity: story, title: story.title })} />
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

export default StoryActions;