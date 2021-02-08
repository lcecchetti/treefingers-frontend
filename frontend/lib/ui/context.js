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

  const openSidebar = () => dispatch({ type: UIActions.openSidebar });
  const closeSidebar = () => dispatch({ type: UIActions.closeSidebar });
  const toggleSidebar = () => state.isSidebarOpen ? dispatch({ type: UIActions.closeSidebar }) : dispatch({ type: UIActions.openSidebar });

  const toggleTheme = (currentTheme) => (currentTheme !== themes.dark ? themes.dark : themes.light);

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
      openSidebar,
      closeSidebar,
      toggleSidebar,
      toggleTheme,
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