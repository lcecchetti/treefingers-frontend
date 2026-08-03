'use client';

import { Users, UserCheck } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { graphql } from '@/lib/graphql/generated';
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/lib/auth/current-user';
import { useState } from 'react';
import * as analytics from '@/lib/analytics';
import { useUI } from '@/lib/ui/context';

const MUTATION_JOIN = graphql(`
  mutation join($input: JoinInput!) {
    join(input: $input) {
      membership {
        id
        forest {
          id
          membersCount
          currentUserMembership {
            id
          }
        }
      }
    }
  }
`);

const MUTATION_LEAVE = graphql(`
  mutation leave($input: LeaveInput!) {
    leave(input: $input) {
      membership {
        id
        forest {
          id
          membersCount
          currentUserMembership {
            id
          }
        }
      }
    }
  }
`);

export interface ForestMembershipForest {
  id: string;
  membersCount: number;
  currentUserMembership?: { id: string } | null;
}

interface ForestMembershipProps {
  forest: ForestMembershipForest;
  viewOnly?: boolean;
}

export const ForestMembership = ({ forest, viewOnly }: ForestMembershipProps) => {
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState(false);
  const { showToast } = useUI();

  const variables = { input: { forest: forest.id } }

  // mutations
  const [join, { loading: joinLoading }] = useMutation(MUTATION_JOIN, {
    variables,
    onCompleted: () => {
      analytics.event({
        action: 'join',
        category: 'forest',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      analytics.event({
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
      analytics.event({
        action: 'leave',
        category: 'forest',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      analytics.event({
        action: 'leave',
        category: 'forest',
        label: 'error',
      });
      setError(true);
    },
  });

  const isSubmitting = joinLoading || leaveLoading;

  const toogleMembership = async () => {
    if (viewOnly || isSubmitting) {
      // block submission
      return;
    }

    if (!currentUser) {
      showToast('You need to be logged in to join.');
      return;
    }

    forest.currentUserMembership ? await leave() : await join();
  }

  // pick icon according to user like presence
  const Icon = forest.currentUserMembership ? UserCheck : Users;

  return (
    <div className={cn(
      'flex gap-sm items-center',
      error && 'text-error',
    )}>
      {!!forest.membersCount &&
        <Text variant="span">{forest.membersCount}</Text>
      }
      <Icon className={cn(
        'w-6 h-6',
        !viewOnly && 'cursor-pointer',
      )}
      onClick={toogleMembership} />
    </div>
  );
}
