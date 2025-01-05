import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import productReducer from '../features/productSlice.js'
import wishlistReducer from '../features/wishlistSlice.js';
import cartReducer from '../features/cartSlice.js'
import orderReducer from '../features/orderSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    order: orderReducer,
  }
});
