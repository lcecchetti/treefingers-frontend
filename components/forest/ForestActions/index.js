import { CommentCount } from 'components/comment';
import { useUI, flyoutTypes } from 'lib/ui/context';
import ForestMembership from 'components/forest/ForestMembership';

const ForestActions = ({ forest }) => {
  const { openFlyout } = useUI();

  return (
    <div className="flex items-center gap-sm justify-end">
      <CommentCount count={forest.commentsCount} action={() => openFlyout(flyoutTypes.comments, { entity: forest, title: 'Comments' })} />
      <ForestMembership forest={forest} />
    </div>
  );
}

export default ForestActions;