import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API_KEY = "AIzaSyAYfao8421huSYAjOZvKRrgXWkGJ3sjF9Y";
  const urlLogin = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  const urlSignUp = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

  useEffect(() => {
    const checkLoginState = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    checkLoginState();
  }, []);

  const storeUserData = async (userData) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(urlLogin + API_KEY, {
        email: email,
        password: password,
        returnSecureToken: true
      });
      storeUserData({ email: email });
    } catch (error) {
      alert("Login Failed: " + error.response.data.error.errors[0].message);
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await axios.post(urlSignUp + API_KEY, {
        email: email,
        password: password,
        returnSecureToken: true
      });
      storeUserData({ email: email });
    } catch (error) {
      alert("Signup Failed: " + error.response.data.error.errors[0].message);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <LoginContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
