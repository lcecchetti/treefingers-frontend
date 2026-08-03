'use client';

import React, { useMemo, type ReactElement, type ReactNode } from 'react';
import * as gtag from '@/lib/gtag';

export const themes = {
  dark: 'dark',
  light: 'light',
};

export const flyoutTypes = {
  comments: 'COMMENTS',
  tree: 'TREE',
  forestNew: 'FORESTNEW',
};

export interface ToastData {
  label: ReactNode;
  id: number;
  duration: number;
  type?: string;
}

export interface UIState {
  isDrawerOpen: boolean;
  isSearchOpen: boolean;
  isFlyoutOpen: boolean;
  flyoutData: unknown;
  flyoutType: string | null;
  toasts: ToastData[];
  toastIndex: number;
}

const initialState: UIState = {
  isDrawerOpen: false,
  isSearchOpen: false,
  isFlyoutOpen: false,
  flyoutData: null,
  flyoutType: null,
  toasts: [],
  toastIndex: 0,
};

interface UIActionsApi {
  openDrawer(): void;
  closeDrawer(): void;
  toggleDrawer(): void;
  getToggledTheme(currentTheme: string): string;
  openSearch(): void;
  closeSearch(): void;
  flyoutTypes: typeof flyoutTypes;
  openFlyout(flyoutType: string, flyoutData?: unknown): void;
  closeFlyout(): void;
  showToast(label: ReactNode, options?: Partial<ToastData>): void;
  dismissToast(id: number): void;
}

export const UIContext = React.createContext<UIState & UIActionsApi>(initialState as UIState & UIActionsApi);

UIContext.displayName = 'UIContext';

export const UIActions = {
  openDrawer: 'OPEN_DRAWER',
  closeDrawer: 'CLOSE_DRAWER',
  openSearch: 'OPEN_SEARCH',
  closeSearch: 'CLOSE_SEARCH',
  openFlyout: 'OPEN_FLYOUT',
  closeFlyout: 'CLOSE_FLYOUT',
  showToast: 'SHOW_TOAST',
  dismissToast: 'DISMISS_TOAST',
} as const;

type UIAction =
  | { type: typeof UIActions.openDrawer }
  | { type: typeof UIActions.closeDrawer }
  | { type: typeof UIActions.openSearch }
  | { type: typeof UIActions.closeSearch }
  | { type: typeof UIActions.openFlyout; flyoutType: string; flyoutData?: unknown }
  | { type: typeof UIActions.closeFlyout }
  | { type: typeof UIActions.showToast; toastData: Partial<ToastData> & { label: ReactNode } }
  | { type: typeof UIActions.dismissToast; id: number };

export function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case UIActions.openDrawer: {
      return {
        ...state,
        isDrawerOpen: true,
      };
    }
    case UIActions.closeDrawer: {
      return {
        ...state,
        isDrawerOpen: false,
      };
    }
    case UIActions.openSearch: {
      return {
        ...state,
        isSearchOpen: true,
      };
    }
    case UIActions.closeSearch: {
      return {
        ...state,
        isSearchOpen: false,
      };
    }
    case UIActions.openFlyout: {
      return {
        ...state,
        isFlyoutOpen: true,
        flyoutData: action.flyoutData,
        flyoutType: action.flyoutType,
      };
    }
    case UIActions.closeFlyout: {
      return {
        ...state,
        isFlyoutOpen: false,
      };
    }
    case UIActions.showToast: {
      return {
        ...state,
        toastIndex: state.toastIndex + 1,
        toasts: [...state.toasts, {
          id: state.toastIndex,
          duration: 3000,
          ...action.toastData,
        }],
      };
    }
    case UIActions.dismissToast: {
      return {
        ...state,
        toasts: [...state.toasts].filter(({ id }) => id !== action.id),
      };
    }
    default: {
      return state;
    }
  }
}

export const UIProvider = (props: { children: React.ReactNode }): ReactElement => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const openDrawer = () => {!state.isDrawerOpen && dispatch({ type: UIActions.openDrawer });}
  const closeDrawer = () => {state.isDrawerOpen && dispatch({ type: UIActions.closeDrawer });}
  const toggleDrawer = () => state.isDrawerOpen ? dispatch({ type: UIActions.closeDrawer }) : dispatch({ type: UIActions.openDrawer });

  const openSearch = () => {!state.isSearchOpen && dispatch({ type: UIActions.openSearch });}
  const closeSearch = () => {state.isSearchOpen && dispatch({ type: UIActions.closeSearch });}

  const getToggledTheme = (currentTheme: string) => (currentTheme !== themes.dark ? themes.dark : themes.light);

  const openFlyout = (flyoutType: string, flyoutData?: unknown) => {
    gtag.event({
      action: 'open-flyout',
      category: 'flyout',
      label: flyoutType,
    });
    dispatch({ type: UIActions.openFlyout, flyoutType, flyoutData });
  }
  const closeFlyout = () => dispatch({ type: UIActions.closeFlyout });

  const showToast = (label: ReactNode, options: Partial<ToastData> = {}) => {
    dispatch({ type: UIActions.showToast, toastData: { label, ...options } });
  };
  const dismissToast = (id: number) => dispatch({ type: UIActions.dismissToast, id });

  const value = useMemo(
    () => ({
      ...state,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      getToggledTheme,
      openSearch,
      closeSearch,
      flyoutTypes,
      openFlyout,
      closeFlyout,
      showToast,
      dismissToast,
    }),
    [state]
  );

  return <UIContext.Provider value={value} {...props} />;
}

export const useUI = (): UIState & UIActionsApi => {
  const context = React.useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
};
