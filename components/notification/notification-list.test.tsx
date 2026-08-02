import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { Toasts } from '@/components/common';
import { graphql } from '@/lib/graphql/generated';
import { renderWithProviders } from '@/test/test-utils';
import { NotificationList, QUERY_NOTIFICATIONS, notificationsVariables } from './notification-list';

const MUTATION_READ_ALL_NOTIFICATIONS = graphql(`
  mutation readAllNotifications {
    readAllNotifications {
      count
    }
  }
`);

beforeEach(() => {
  // NotificationList wraps its content in InfiniteScroll, which needs both of these in jsdom.
  vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation(function () {
    return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
  }));
  Element.prototype.scrollTo = vi.fn();
});

function notification(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    cursor: 'n1',
    node: {
      id: 'n1',
      type: 'ACTIVATE_ACCOUNT',
      sourceId: null,
      targetId: null,
      read: false,
      createdAt: '2024-03-05T10:00:00.000Z',
      actor: null,
      content: 'Welcome!',
      link: '/story/new',
      ...overrides,
    },
  };
}

describe('NotificationList', () => {
  it('shows an empty-state message when there are no notifications', async () => {
    const mocks = [{
      request: { query: QUERY_NOTIFICATIONS, variables: notificationsVariables },
      result: { data: { notifications: { edges: [], pageInfo: { endCursor: null, hasNextPage: false, totalCount: 0 }, unreadCount: 0 } } },
    }];

    renderWithProviders(<NotificationList />, { mocks });

    expect(await screen.findByText(/nothing new has happened/i)).toBeInTheDocument();
  });

  it('shows the unread count and marks all as read on click', async () => {
    const user = userEvent.setup();
    const listResult = {
      data: {
        notifications: {
          edges: [notification()],
          pageInfo: { endCursor: 'n1', hasNextPage: false, totalCount: 1 },
          unreadCount: 3,
        },
      },
    };

    const mocks = [
      { request: { query: QUERY_NOTIFICATIONS, variables: notificationsVariables }, result: listResult },
      {
        request: { query: MUTATION_READ_ALL_NOTIFICATIONS },
        result: { data: { readAllNotifications: { count: 3 } } },
      },
      // refetch triggered by onCompleted
      {
        request: { query: QUERY_NOTIFICATIONS, variables: notificationsVariables },
        result: {
          data: { notifications: { ...listResult.data.notifications, unreadCount: 0 } },
        },
      },
    ];

    renderWithProviders(
      <>
        <NotificationList />
        <Toasts />
      </>,
      { mocks }
    );

    expect(await screen.findByText(/You have 3 unread notifications/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Read all' }));

    expect(await screen.findByText(/All 3 notifications have been marked as read/)).toBeInTheDocument();
  });
});
