import React, { useMemo } from 'react';
import * as gtag from 'lib/gtag';

export const themes = {
  dark: 'dark',
  light: 'light',
};

export const flyoutTypes = {
  comments: 'COMMENTS',
  tree: 'TREE',
  forestNew: 'FORESTNEW',
};

const initialState = {
  isDrawerOpen: false,
  isFlyoutOpen: false,
  flyoutData: null,
  flyoutType: null,
  toasts: [],
  toastIndex: 0,
}

export const UIContext = React.createContext(initialState);

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
};

function uiReducer(state, action) {
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
        toasts: [...state.toasts, { 
          label: action.label, 
          id: state.toastIndex++, 
          duration: 5000,
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
  }
}

export const UIProvider = (props) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const openDrawer = () => {!state.isDrawerOpen && dispatch({ type: UIActions.openDrawer });}
  const closeDrawer = () => {state.isDrawerOpen && dispatch({ type: UIActions.closeDrawer });}
  const toggleDrawer = () => state.isDrawerOpen ? dispatch({ type: UIActions.closeDrawer }) : dispatch({ type: UIActions.openDrawer });

  const openSearch = () => {!state.isSearchOpen && dispatch({ type: UIActions.openSearch });}
  const closeSearch = () => {state.isSearchOpen && dispatch({ type: UIActions.closeSearch });}

  const getToggledTheme = (currentTheme) => (currentTheme !== themes.dark ? themes.dark : themes.light);

  const openFlyout = (flyoutType, flyoutData) => {
    gtag.event({
      action: 'open-flyout',
      category: 'flyout',
      label: flyoutType,
    });
    dispatch({ type: UIActions.openFlyout, flyoutType, flyoutData });
  }
  const closeFlyout = () => dispatch({ type: UIActions.closeFlyout });

  const showToast = (label, options = {}) => {
    dispatch({ type: UIActions.showToast, toastData: { label, ...options } });
  };
  const dismissToast = (id) => dispatch({ type: UIActions.dismissToast, id });

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

export const useUI = () => {
  const context = React.useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
};