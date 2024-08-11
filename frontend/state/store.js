import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch order history
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get('http://localhost:9009/api/pizza/history');
  return response.data;
});

// Async thunk to submit a new pizza order
export const submitOrder = createAsyncThunk(
  'orders/submitOrder',
  async (order, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:9009/api/pizza/order', order);
      return response.data;
    } catch (err) {
      // Return the server error message directly
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  }
);


// Slice for managing order history
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(submitOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = 'failed';

        console.log(action.payload)
        // Use action.payload if available, otherwise use action.error.message
        state.error =  action.error.message;
      });
      
  },
});

// Slice for managing the size filter state
const sizeFilterSlice = createSlice({
  name: 'sizeFilter',
  initialState: 'All',
  reducers: {
    setSizeFilter: (state, action) => action.payload,
  },
});

// Slice for managing the pizza form state
const pizzaFormSlice = createSlice({
  name: 'pizzaForm',
  initialState: {
    fullName: '',
    size: '',
    toppings: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    },
    status: 'idle',
    error: null,
  },
  reducers: {
    updateFormState: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetFormState: () => {
      return {
        fullName: '',
        size: '',
        toppings: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
        },
        status: 'idle',
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.status = 'succeeded';
        // reset the form after successful submission
        state.fullName = '';
        state.size = '';
        state.toppings = {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
        };
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { setSizeFilter } = sizeFilterSlice.actions;
export const { updateFormState, resetFormState } = pizzaFormSlice.actions;

// Configure and export the store
export const resetStore = () =>
  configureStore({
    reducer: {
      orders: ordersSlice.reducer,
      sizeFilter: sizeFilterSlice.reducer,
      pizzaForm: pizzaFormSlice.reducer,
    },
    middleware: (getDefault) =>
      getDefault().concat(
        // add your middleware here if needed
      ),
  });

export const store = resetStore();

