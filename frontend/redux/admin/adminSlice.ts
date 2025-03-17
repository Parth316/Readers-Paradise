import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define interfaces based on your backend models
interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  images: string[];
  qty: string;
  price: number;
  availabilty: boolean;
  genre: string;
  pages: number;
  publisher: string;
  published_date: Date;
  rating: number;
  reviews: number;
  status: string;
  date: Date;
}

interface Order {
  _id: string;
  userId: string;
  items: {
    bookId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  shippingAddress: {
    recipientName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    email: string;
    deliveryInstructions?: string;
  };
  totalAmount: number;
  status: string;
  carrier?: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminState {
  books: Book[];
  orders: Order[];
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  books: [],
  orders: [],
  users: [],
  loading: false,
  error: null,
};

const BACKEND_URL = "http://localhost:5000";

// Async thunk to fetch admin data
export const fetchAdminData = createAsyncThunk(
  "admin/fetchAdminData",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No authentication token found. Please log in as an admin.");
    }

    try {
      const [booksResponse, ordersResponse, usersResponse] = await Promise.all([
        axios.get<Book[]>(`${BACKEND_URL}/api/admin/listBooks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<Order[]>(`${BACKEND_URL}/api/admin/listOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<User[]>(`${BACKEND_URL}/api/admin/listUsers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      return {
        books: booksResponse.data,
        orders: ordersResponse.data,
        users: usersResponse.data,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.status === 401
          ? "Authentication failed. Please log in again."
          : err.response?.data?.message || "Error fetching data. Please try again later."
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminData.fulfilled,
        (
          state,
          action: PayloadAction<{
            books: Book[];
            orders: Order[];
            users: User[];
          }>
        ) => {
          state.loading = false;
          state.books = action.payload.books;
          state.orders = action.payload.orders;
          state.users = action.payload.users;
        }
      )
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;