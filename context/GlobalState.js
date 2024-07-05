import React, { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [isLoading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [token, setToken] = useState('');

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const setScreen = (screen) => setCurrentScreen(screen);
  const login = (user, token) => {
    setIsAuth(true);
    setUserDetail(user);
    setToken(token);
    setScreen('Home');
  };
  const logout = () => {
    setIsAuth(false);
    setUserDetail(null);
    setToken('');
    setCurrentScreen('Login');
  };

  return (
    <GlobalStateContext.Provider value={{ currentScreen, isLoading, isAuth, userDetail, token, startLoading, stopLoading, setScreen, login, logout }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
