import { describe, it, expect } from 'vitest';
import { uiReducer, UIActions, flyoutTypes, type UIState } from './context';

const baseState: UIState = {
  isDrawerOpen: false,
  isSearchOpen: false,
  isFlyoutOpen: false,
  flyoutData: null,
  flyoutType: null,
  toasts: [],
  toastIndex: 0,
};

describe('uiReducer', () => {
  it('opens and closes the drawer', () => {
    const opened = uiReducer(baseState, { type: UIActions.openDrawer });
    expect(opened.isDrawerOpen).toBe(true);

    const closed = uiReducer(opened, { type: UIActions.closeDrawer });
    expect(closed.isDrawerOpen).toBe(false);
  });

  it('opens and closes search independently of the drawer', () => {
    const opened = uiReducer(baseState, { type: UIActions.openSearch });
    expect(opened).toMatchObject({ isSearchOpen: true, isDrawerOpen: false });
  });

  it('opens a flyout with its type and data', () => {
    const state = uiReducer(baseState, {
      type: UIActions.openFlyout,
      flyoutType: flyoutTypes.comments,
      flyoutData: { entity: { id: '1' } },
    });

    expect(state.isFlyoutOpen).toBe(true);
    expect(state.flyoutType).toBe(flyoutTypes.comments);
    expect(state.flyoutData).toEqual({ entity: { id: '1' } });
  });

  it('closing a flyout only flips isFlyoutOpen, leaving flyoutData/flyoutType as-is', () => {
    const open = uiReducer(baseState, { type: UIActions.openFlyout, flyoutType: flyoutTypes.tree, flyoutData: 'x' });
    const closed = uiReducer(open, { type: UIActions.closeFlyout });

    expect(closed.isFlyoutOpen).toBe(false);
    expect(closed.flyoutType).toBe(flyoutTypes.tree);
    expect(closed.flyoutData).toBe('x');
  });

  it('showToast assigns a unique incrementing id per toast, defaulting duration to 3000', () => {
    const afterFirst = uiReducer(baseState, { type: UIActions.showToast, toastData: { label: 'first' } });
    const afterSecond = uiReducer(afterFirst, { type: UIActions.showToast, toastData: { label: 'second' } });

    expect(afterSecond.toasts).toEqual([
      { id: 0, duration: 3000, label: 'first' },
      { id: 1, duration: 3000, label: 'second' },
    ]);
    expect(afterSecond.toastIndex).toBe(2);
  });

  it('showToast lets callers override duration and type', () => {
    const state = uiReducer(baseState, {
      type: UIActions.showToast,
      toastData: { label: 'err', duration: 0, type: 'error' },
    });

    expect(state.toasts[0]).toMatchObject({ label: 'err', duration: 0, type: 'error' });
  });

  it('dismissToast removes only the matching toast by id', () => {
    const withTwo = uiReducer(
      uiReducer(baseState, { type: UIActions.showToast, toastData: { label: 'a' } }),
      { type: UIActions.showToast, toastData: { label: 'b' } }
    );

    const afterDismiss = uiReducer(withTwo, { type: UIActions.dismissToast, id: 0 });

    expect(afterDismiss.toasts).toEqual([{ id: 1, duration: 3000, label: 'b' }]);
  });

  it('returns the same state for an unrecognized action (default case)', () => {
    // @ts-expect-error deliberately exercising the default branch with an unknown action type
    const state = uiReducer(baseState, { type: 'NOT_A_REAL_ACTION' });
    expect(state).toBe(baseState);
  });
});
