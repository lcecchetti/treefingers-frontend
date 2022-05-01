import { FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';

const MUTATION_FOLLOW = gql`
  mutation follow($input: FollowInput!) {
    follow(input: $input) {
      followership {
        _id
        followed {
          _id
          followersCount
          currentUserFollowership {
            _id
          }
        }
      } 
    }
  }
`;

const MUTATION_UNFOLLOW = gql`
  mutation unfollow($input: UnfollowInput!) {
    unfollow(input: $input) {
      followership {
        _id
        followed {
          _id
          followersCount
          currentUserFollowership {
            _id
          }
        }
      } 
    }
  }
`;

const UserFollowership = ({ user, viewOnly }) => {
  const { currentUser } = useCurrentUser();

  const variables = { input: { followed: user._id } }

  // mutations
  const [follow, { error: followError, loading: followLoading }] = useMutation(MUTATION_FOLLOW, {
    variables,
  });
  const [unfollow, { error: unfollowError, loading: unfollowLoading }] = useMutation(MUTATION_UNFOLLOW, {
    variables,
  });

  const isSubmitting = followLoading || unfollowLoading;
  const isError = followError || unfollowError;

  // set always not editable for non logged in users
  viewOnly = viewOnly || !currentUser;

  /**
   * Toogle followership status for logged in users
   */
  const toogleFollowership = async () => {
    if (viewOnly || isSubmitting) {
      // block submission
      return;
    }

    user.currentUserFollowership ? await unfollow() : await follow();
  }

  // pick icon accoridng to user followership
  const Icon = user.currentUserFollowership ? FaUserCheck : FaUserPlus;

  return (
    <div className={clsx(
      'flex gap-sm items-center',
      isError && 'text-error',
    )}>
      {!!user.followersCount &&
        <Text variant="span">{user.followersCount}</Text>
      }
      <Icon className={clsx(
        'text-2xl',
        !viewOnly && 'cursor-pointer',
      )} 
      onClick={toogleFollowership} />
    </div>
  );
}

export default UserFollowership;