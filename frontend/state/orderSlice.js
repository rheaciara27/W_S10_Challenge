import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    orders: [], 
    status: 'idle', 
    error: null
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await fetch('/api/orders');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
});

export const createOrder = createAsyncThunk('orders/createOrder', async (order) => {
    const response = await fetch('/api/orders', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    }); 

    if(!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
});

const orderSlice = createSlice({
    name: 'orders',
    initialState, 
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded'; 
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'succeeded'; 
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }  
});

export default orderSlice.reducer;