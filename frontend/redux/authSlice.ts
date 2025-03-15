import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id?: string;
  email?: string;
  name?: string;
  role: "user" | "admin";
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    signupSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isAuthenticated = true; // Auto-login after signup
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  setError,
  logout,
  signupFailure,
  signupSuccess,
  resetError,
} = authSlice.actions;

export default authSlice.reducer;