import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './orderSlice';
import sizeFilterReducer from './sizeFilterSlice';

const exampleReducer = (state = { count: 0 }) => {
  return state
}

export const resetStore = () => configureStore({
  reducer: {
    orders: ordersReducer, 
    sizeFilter: sizeFilterReducer,
  },
  middleware: (getDefault) => getDefault().concat(
    // if using RTK Query for your networking: add your middleware here
    // if using Redux Thunk for your networking: you can ignore this
  ),
})

export const store = resetStore();
