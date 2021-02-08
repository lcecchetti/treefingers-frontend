import React, { useMemo } from 'react';

export const themes = {
  dark: 'dark',
  light: 'light',
};

const initialState = {
  isDrawerOpen: false,
}

export const UIContext = React.createContext(initialState);

UIContext.displayName = 'UIContext';

export const UIActions = {
  openDrawer: 'OPEN_DRAWER',
  closeDrawer: 'CLOSE_DRAWER',
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
  }
}

export const UIProvider = (props) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const openDrawer = () => dispatch({ type: UIActions.openDrawer });
  const closeDrawer = () => dispatch({ type: UIActions.closeDrawer });
  const toggleDrawer = () => state.isDrawerOpen ? dispatch({ type: UIActions.closeDrawer }) : dispatch({ type: UIActions.openDrawer });

  const getToggledTheme = (currentTheme) => (currentTheme !== themes.dark ? themes.dark : themes.light);

  const disableBodyScroll = () => {
    document.body.classList.add('overflow-hidden');
    document.body.classList.add('md:overflow-auto');
  };
  const enableBodyScroll = () => {
    document.body.classList.remove('overflow-hidden');
    document.body.classList.remove('md:overflow-auto');
  };

  const value = useMemo(
    () => ({
      ...state,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      getToggledTheme,
      disableBodyScroll,
      enableBodyScroll,
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