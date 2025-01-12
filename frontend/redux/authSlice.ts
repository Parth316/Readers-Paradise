import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state) {
            state.isAuthenticated = true;
            state.error = null;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.error = null;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        signupSuccess(state) {
            // Clear any errors after successful signup
            state.error = null;
            // Optionally, if you want to auto-login after signup:
            // state.isAuthenticated = true;
        },
        signupFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        resetError(state) {
            state.error = null;
        }
    }
});

export const {
    loginSuccess,
    loginFailure,
    setError,
    logout,
    signupFailure,
    signupSuccess,
    resetError
} = authSlice.actions;

export default authSlice.reducer;