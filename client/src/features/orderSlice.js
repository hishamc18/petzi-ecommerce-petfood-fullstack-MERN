import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import { endPoints } from '../api/endpoints';
import { handleError } from '../utils/errorHandler';

// Place order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endPoints.ORDER.CREATE, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Verify payment
export const verifyPayment = createAsyncThunk(
  'order/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(endPoints.ORDER.VERIFY_PAYMENT, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Fetch user orders (with pagination)
export const fetchUserOrdersById = createAsyncThunk(
  'order/fetchUserOrdersbyId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endPoints.ADMIN.ORDERS.GET_BY_ID(id));
      return response.data.order;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Fetch user orders (with pagination)
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endPoints.ORDER.GET_USER_ORDERS, params);
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);


// Cancel order
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(endPoints.ORDER.CANCEL(orderId));
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Fetch all orders with pagination
export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endPoints.ADMIN.ORDERS.GET_ALL, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);


// Toggle order status (shipped → delivered → cancelled)
export const toggleOrderStatus = createAsyncThunk(
  'order/toggleOrderStatus',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(endPoints.ADMIN.ORDERS.TOGGLE_STATUS(orderId));
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);


//fetch total revenue
export const fetchRevenue = createAsyncThunk(
  'revenue/fetchRevenue', async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endPoints.ADMIN.REVENUE.GET_TOTAL);
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

//users with most orders
export const getUsersWithMostOrders = createAsyncThunk(
  'mostOrders/getUsersWithMostOrders', async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endPoints.ADMIN.STATISTICS.USER_WITH_MOST_ORDERS);

      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)


//revenue chart
export const revenueChart = createAsyncThunk(
  'revenueBar/revenueChart', async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endPoints.ADMIN.STATISTICS.REVENUE_CHART);

      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)



const orderSlice = createSlice({
  name: 'order',
  initialState: {
    userOrder: null,
    orders: [],
    loading: false,
    error: null,
    paymentVerified: false,
    allOrders: [],
    order: null,
    totalOrders: 0,
    totalRevenue: 0,
    topUsers: [],
    dailyRevenue: [],
    weeklyRevenue: [],
    monthlyRevenue: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Place order actions
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify payment actions
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentVerified = true;
        state.order.paymentVerified = true;
        state.error = 'Payment verification failed';
        console.log(JSON.parse(JSON.stringify(state.order)));

      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user orders actions
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user orders by id actions
      .addCase(fetchUserOrdersById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrdersById.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrder = action.payload;
      })
      .addCase(fetchUserOrdersById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel order actions
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((order) => order.id !== action.payload.cancelledOrder.id);
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle order status actions
      .addCase(toggleOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
        );
        state.allOrders = state.allOrders.map((order) =>
          order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
        );
      })
      .addCase(toggleOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // revenue
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.totalRevenue = action.payload.totalRevenue
      })
      //user with most orders
      .addCase(getUsersWithMostOrders.fulfilled, (state, action) => {
        state.topUsers = action.payload;
      })
      //revenue chart
      .addCase(revenueChart.fulfilled, (state, action) => {
        state.dailyRevenue = action.payload.dailyRevenue;
        state.weeklyRevenue = action.payload.weeklyRevenue;
        state.monthlyRevenue = action.payload.monthlyRevenue;
      })
  },
});

export default orderSlice.reducer;
