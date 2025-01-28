import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface BookState {
    success: boolean;
    error: string | null;
    type: string;
    loading: boolean;
}

const initialState: BookState = {
    success: false,
    error: null,
    type: 'Add',
    loading: false,
};

// Async thunk for adding a book
export const addBook = createAsyncThunk(
    'book/addBook',
    async (bookData: { title: string; author: string; isbn: string; description: string; image: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/books', bookData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        resetState(state) {
            state.success = false;
            state.error = null;
            state.type = 'Add';
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBook.fulfilled, (state) => {
                state.success = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(addBook.rejected, (state, action: PayloadAction<any>) => {
                state.success = false;
                state.loading = false;
                state.error = action.payload ? action.payload.message : 'Failed to add book';
            });
    }
});

export const { resetState } = bookSlice.actions;
export default bookSlice.reducer;