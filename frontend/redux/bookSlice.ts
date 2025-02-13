import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Book {
  id: string;
  title: string;
  description: string;
  author:string;
  isbn:string;
  qty:string
}

// Thunk for fetching books
export const fetchBooks = createAsyncThunk(
  'book/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5173/api/books');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }

);

interface BookState {
  books: Book[];
  success: boolean;
  error: string | null;
  type: string;
  loading: boolean;
}

const initialState: BookState = {
  books: [],
  success: false,
  error: null,
  type: 'Add',
  loading: false,
};

export const addBook = createAsyncThunk(
  'book/addBook',
  async (bookData: { title: string; author: string; isbn: string; description: string; image: string, qty: string; }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/books', bookData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to add book');
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
        state.error = action.payload;
      })
    
  }
});

export const { resetState } = bookSlice.actions;
export default bookSlice.reducer;