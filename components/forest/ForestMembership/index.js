import { FaUsers, FaUserCheck } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import { useState } from 'react';
import * as gtag from 'lib/gtag';

const MUTATION_JOIN = gql`
  mutation join($input: JoinInput!) {
    join(input: $input) {
      membership {
        _id
        forest {
          _id
          membersCount
          currentUserMembership {
            _id
          }
        }
      } 
    }
  }
`;

const MUTATION_LEAVE = gql`
  mutation leave($input: LeaveInput!) {
    leave(input: $input) {
      membership {
        _id
        forest {
          _id
          membersCount
          currentUserMembership {
            _id
          }
        }
      } 
    }
  }
`;

const ForestMembership = ({ forest, viewOnly }) => {
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState(false);
  
  const variables = { input: { forest: forest._id } }

  // mutations
  const [join, { loading: joinLoading }] = useMutation(MUTATION_JOIN, {
    variables,
    onCompleted: () => {
      gtag.event({
        action: 'join',
        category: 'forest',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      gtag.event({
        action: 'join',
        category: 'forest',
        label: 'error',
      });
      setError(true);
    },
  });
  const [leave, { loading: leaveLoading }] = useMutation(MUTATION_LEAVE, {
    variables,
    onCompleted: () => {
      gtag.event({
        action: 'leave',
        category: 'forest',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      gtag.event({
        action: 'leave',
        category: 'forest',
        label: 'error',
      });
      setError(true);
    },
  });

  const isSubmitting = joinLoading || leaveLoading;

  // set always not editable for non logged in users
  viewOnly = viewOnly || !currentUser;

  /**
   * Toogle like status for logged in users
   */
  const toogleMembership = async () => {
    if (viewOnly || isSubmitting) {
      // block submission
      return;
    }

    forest.currentUserMembership ? await leave() : await join();
  }

  // pick icon accoridng to user like presence
  const Icon = forest.currentUserMembership ? FaUserCheck : FaUsers;

  return (
    <div className={clsx(
      'flex gap-sm items-center',
      error && 'text-error',
    )}>
      {!!forest.membersCount &&
        <Text variant="span">{forest.membersCount}</Text>
      }
      <Icon className={clsx(
        'text-2xl',
        !viewOnly && 'cursor-pointer',
      )} 
      onClick={toogleMembership} />
    </div>
  );
}

export default ForestMembership;