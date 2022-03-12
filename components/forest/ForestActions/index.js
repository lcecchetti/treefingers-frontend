import { CommentCount } from 'components/comment';
import { useUI, flyoutTypes } from 'lib/ui/context';
import Membership from '../Membership';

const ForestActions = ({ forest }) => {
  const { openFlyout } = useUI();

  return (
    <div className="flex items-center gap-sm justify-end">
      <CommentCount count={forest.commentsCount} action={() => openFlyout(flyoutTypes.comments, { entity: forest, title: 'Comments' })} />
      <Membership forest={forest} />
    </div>
  );
}

export default ForestActions;