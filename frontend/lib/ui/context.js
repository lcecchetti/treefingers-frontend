import React, { useMemo } from 'react';

const initialState = {
  isSidebarOpen: false,
}

export const UIContext = React.createContext(initialState);

UIContext.displayName = 'UIContext';

export const UIActions = {
  toggleTheme: 'TOGGLE_THEME',
  openSidebar: 'OPEN_SIDEBAR',
  closeSidebar: 'CLOSE_SIDEBAR',
};

function uiReducer(state, action) {
  switch (action.type) {
    case UIActions.toggleTheme: {
      return {
        ...state,
        theme: action.theme,
      }
    }
    case UIActions.openSidebar: {
      return {
        ...state,
        isSidebarOpen: true,
      }
    }
    case UIActions.closeSidebar: {
      return {
        ...state,
        isSidebarOpen: false,
      }
    }
  }
}

export const UIProvider = (props) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const openSidebar = () => dispatch({ type: UI_ACTIONS.OPEN_SIDEBAR });
  const closeSidebar = () => dispatch({ type: UI_ACTIONS.CLOSE_SIDEBAR });
  const toggleSidebar = () => state.isSidebarOpen ? dispatch({ type: UI_ACTIONS.CLOSE_SIDEBAR }) : dispatch({ type: UI_ACTIONS.OPEN_SIDEBAR });

  const toggleTheme = (currentTheme) => (currentTheme !== themes.dark ? themes.dark : themes.light);

  const value = useMemo(
    () => ({
      ...state,
      openSidebar,
      closeSidebar,
      toggleSidebar,
      toggleTheme,
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