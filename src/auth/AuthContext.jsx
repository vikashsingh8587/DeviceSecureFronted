import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, logout, clearAuthError } from "../store/slices/authSlice";

const AuthContext = createContext(null);

// Compatibility wrapper: existing pages can keep calling useAuth while auth state
// and async workflows are managed centrally by Redux Toolkit.
export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const onUnauthorized = () => dispatch(logout());
    window.addEventListener("og:unauthorized", onUnauthorized);
    return () => window.removeEventListener("og:unauthorized", onUnauthorized);
  }, [dispatch]);
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  useContext(AuthContext);
  const dispatch = useDispatch();
  const { token, user, status, error } = useSelector(state => state.auth);
  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) return result.payload;
    throw new Error(result.payload || "Unable to sign in.");
  };
  const register = async (full_name, email, password) => {
    const result = await dispatch(registerUser({ full_name, email, password }));
    if (registerUser.fulfilled.match(result)) return result.payload;
    throw new Error(result.payload || "Unable to register.");
  };
  return {
    token, user, status, error, isAuthenticated: Boolean(token),
    login, register, logout: () => dispatch(logout()),
    clearAuthError: () => dispatch(clearAuthError())
  };
}
