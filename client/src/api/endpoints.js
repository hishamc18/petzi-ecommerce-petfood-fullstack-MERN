export const endPoints = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
    ME: "/me",
    REFRESH_TOKEN: "/refresh-token",
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id) => `/products/${id}`,
    SEARCH: '/products/search',
  },
  WISHLIST: {
    GET_ALL: '/users/wishlist',
    ADD: (productId) => `/users/wishlist/${productId}`,
    REMOVE: (productId) => `/users/wishlist/${productId}`,
    CLEAR: '/users/wishlist',
  },
  CART: {
    GET_ALL: '/users/cart',
    ADD_PRODUCT: (productId) => `/users/cart/${productId}`,
    REMOVE_PRODUCT: (productId) => `/users/cart/${productId}`,
    UPDATE_QUANTITY: (productId, action) => `/users/cart/${productId}/${action}`,
    CLEAR_CART: '/users/cart/clear'
  },
  ORDER: {
    CREATE: '/users/order/create',
    VERIFY_PAYMENT: '/users/verify-payment',
    GET_USER_ORDERS: '/users/orders',
    CANCEL: (orderId) => `/users/orders/${orderId}/cancel`,
  },
  ADMIN: {
    USERS: {
      GET_ALL: '/admin/users',
      GET_BY_ID: (id) => `/admin/users/${id}`,
      BLOCK_UNBLOCK: (id) => `/admin/users/${id}/block-unblock`,
    },
    CART: {
      GET_CART_FOR_USER: (id) => `/users/cart/${id}`
    },
    ORDERS: {
      GET_ALL: '/admin/orders',
      GET_BY_ID: (id) => `/admin/orders/${id}`,
      TOGGLE_STATUS: (id) => `/admin/orders/${id}/toggle-status`,
    },
    REVENUE: {
      GET_TOTAL: '/admin/revenue',
    },
    STATISTICS: {
      GET_TOP_SELLING_PRODUCTS: '/admin/top-selling-products',
      USER_WITH_MOST_ORDERS: "/admin/top-users",
      REVENUE_CHART: "/admin/revenue-chartjs"
    },
    PRODUCTS: {
      ADD: '/addProduct',
      EDIT: (id) => `/editProduct/${id}`,
      DELETE: (id) => `/deleteProduct/${id}`,
    }
  }
}