import { CommentCount } from 'components/comment';
import { useUI, flyoutTypes } from 'lib/ui/context';
import ForestMembership, { type ForestMembershipForest } from 'components/forest/ForestMembership';

export interface ForestActionsForest extends ForestMembershipForest {
  commentsCount: number;
}

interface ForestActionsProps {
  forest: ForestActionsForest;
}

const ForestActions = ({ forest }: ForestActionsProps) => {
  const { openFlyout } = useUI();

  return (
    <div className="flex items-center gap-sm justify-end">
      <CommentCount count={forest.commentsCount} action={() => openFlyout(flyoutTypes.comments, { entity: forest, title: 'Comments' })} />
      <ForestMembership forest={forest} />
    </div>
  );
}

export default ForestActions;
