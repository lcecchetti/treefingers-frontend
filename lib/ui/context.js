import React, { useMemo } from 'react';

export const themes = {
  dark: 'dark',
  light: 'light',
};

export const flyoutTypes = {
  comments: 'COMMENTS',
  tree: 'TREE',
};

const initialState = {
  isDrawerOpen: false,
  isFlyoutOpen: false,
  flyoutData: null,
  flyoutType: null,
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
};

function uiReducer(state, action) {
  switch (action.type) {
    case UIActions.openDrawer: {
      return {
        ...state,
        isDrawerOpen: true,
      }
    }
    case UIActions.closeDrawer: {
      return {
        ...state,
        isDrawerOpen: false,
      }
    }
    case UIActions.openSearch: {
      return {
        ...state,
        isSearchOpen: true,
      }
    }
    case UIActions.closeSearch: {
      return {
        ...state,
        isSearchOpen: false,
      }
    }
    case UIActions.openFlyout: {
      return {
        ...state,
        isFlyoutOpen: true,
        flyoutData: action.flyoutData,
        flyoutType: action.flyoutType,
      }
    }
    case UIActions.closeFlyout: {
      return {
        ...state,
        isFlyoutOpen: false,
      }
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

  const openFlyout = (flyoutType, flyoutData) => {dispatch({ type: UIActions.openFlyout, flyoutType, flyoutData });}
  const closeFlyout = () => {dispatch({ type: UIActions.closeFlyout });}

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