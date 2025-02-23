// src/store/bookSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Update the Book interface to include optional images for the slider
export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  isbn: string;
  qty: string;
  images?: string[];
}

export const fetchBooks = createAsyncThunk(
  "book/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5173/api/books");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch books");
    }
  }
);

export const addBook = createAsyncThunk(
  "book/addBook",
  async (
    bookData: {
      title: string;
      author: string;
      isbn: string;
      description: string;
      image: string;
      qty: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/api/books", bookData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add book");
    }
  }
);

interface BookState {
  books: Book[];
  selectedBook: Book | null;
  success: boolean;
  error: string | null;
  type: string;
  loading: boolean;
}

const initialState: BookState = {
  books: [],
  selectedBook: null,
  success: false,
  error: null,
  type: "Add",
  loading: false,
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    resetState(state) {
      state.success = false;
      state.error = null;
      state.type = "Add";
      state.loading = false;
    },
    setSelectedBook(state, action: PayloadAction<Book>) {
      state.selectedBook = action.payload;
    },
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
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState, setSelectedBook } = bookSlice.actions;
export default bookSlice.reducer;
