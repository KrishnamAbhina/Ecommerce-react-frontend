import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login as loginAPI, registerUser } from '../APIs/AuthAPI';

const AuthContext = createContext();

const isTokenValid = (token) => {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return true;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const getInitialState = () => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return {
      user: null,
      loading: false,
      error: null,
    };
  }

  const user = JSON.parse(storedUser);
  if (isTokenValid(user.accessToken)) {
    return {
      user,
      loading: false,
      error: null,
    };
  }

  localStorage.removeItem('user');
  return {
    user: null,
    loading: false,
    error: null,
  };
};

// Initial state
const initialState = getInitialState();

// Action types
const ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  SIGNUP_USER_START: 'SIGNUP_USER_START',
  SIGNUP_USER_SUCCESS: 'SIGNUP_USER_SUCCESS',
  SIGNUP_USER_ERROR: 'SIGNUP_USER_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESTORE_USER: 'RESTORE_USER',
  REFRESH_TOKEN_START: 'REFRESH_TOKEN_START',
  REFRESH_TOKEN_SUCCESS: 'REFRESH_TOKEN_SUCCESS',
  REFRESH_TOKEN_ERROR: 'REFRESH_TOKEN_ERROR',
};

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ACTIONS.SIGNUP_USER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ACTIONS.SIGNUP_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case ACTIONS.SIGNUP_USER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        error: null,
      };

    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ACTIONS.RESTORE_USER:
      return {
        ...state,
        user: action.payload,
      };

    case ACTIONS.REFRESH_TOKEN_START:
      return {
        ...state,
        loading: true,
      };
    case ACTIONS.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case ACTIONS.REFRESH_TOKEN_ERROR:
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshTokenIfNeeded = async () => false;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch({ type: ACTIONS.RESTORE_USER, payload: JSON.parse(storedUser) });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: ACTIONS.LOGIN_START });
    try {
      const response = await loginAPI(email, password);
      const userData = response;

      if (!userData.accessToken) {
        throw new Error('No access token provided by server');
      }

      if (!isTokenValid(userData.accessToken)) {
        throw new Error('Invalid or expired token from server');
      }

      const user = {
        email: userData.email,
        name: userData.fullName || email.split('@')[0],
        role: userData.role,
        id: userData.id,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      };
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: user });
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: ACTIONS.LOGIN_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const signUpAsUser = async (fullName, email, password, confirmPassword, phoneNumber) => {
    dispatch({ type: ACTIONS.SIGNUP_USER_START });
    try {
      const result = await registerUser(fullName, email, password, confirmPassword, phoneNumber);
      const userData = result.data || result;

      if (!userData.accessToken) {
        dispatch({ type: ACTIONS.SIGNUP_USER_ERROR, payload: 'Registration successful. No token provided. Please log in.' });
        return { success: true, data: result, noToken: true, message: 'Registration successful. Please log in with your credentials.' };
      }

      if (!isTokenValid(userData.accessToken)) {
        throw new Error('Invalid or expired token from server');
      }

      const user = {
        email,
        name: fullName,
        role: 'user',
        id: userData.id,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      };
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: ACTIONS.SIGNUP_USER_SUCCESS, payload: user });
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: ACTIONS.SIGNUP_USER_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: ACTIONS.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  const contextValue = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    signUpAsUser,
    logout,
    clearError,
    refreshTokenIfNeeded,
    isTokenValid,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
