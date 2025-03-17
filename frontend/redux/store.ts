import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookReducer from './bookSlice';
import adminReducer from './admin/adminSlice'
const store = configureStore({
    reducer:{
        auth: authReducer,
        book: bookReducer,
        admin: adminReducer,
    }
},);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;   