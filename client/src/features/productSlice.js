import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from '../utils/errorHandler';
import axiosInstance from '../api/axiosInstance';
import { endPoints } from '../api/endpoints';

// Initial State
const initialState = {
  products: [],
  product: null,
  totalProducts: 0,
  total: 0,
  pages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  hasMore: true,
  category: null,
  totalCatProducts: 0,
  totalDogProducts: 0,
  topSellingProducts: []
};


// Fetch all products (with optional query params)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 12, name, category }, { rejectWithValue }) => {
    try {
      const params = { page, limit, name, category };
      const response = await axiosInstance.get(endPoints.PRODUCTS.GET_ALL, { params });
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Fetch product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endPoints.ADMIN.PRODUCTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("oldPrice", productData.oldPrice);
      formData.append("image", productData.image);
      formData.append("category", productData.category);
      formData.append("seller", productData.seller);
      formData.append("stock", productData.stock);
      formData.append("description", productData.description);
      formData.append("ingredients", productData.ingredients);
      const response = await axiosInstance.post(endPoints.ADMIN.PRODUCTS.ADD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

//editProduct
export const editProduct = createAsyncThunk(
  'products/editProduct',
  async ({ productId, updateData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", updateData.name);
      formData.append("price", updateData.price);
      formData.append("oldPrice", updateData.oldPrice);
      formData.append("category", updateData.category);
      formData.append("seller", updateData.seller);
      formData.append("stock", updateData.stock);
      formData.append("description", updateData.description);
      formData.append("ingredients", updateData.ingredients);

      if (updateData.image) {
        formData.append("image", updateData.image); 
      }

      const response = await axiosInstance.put(
        endPoints.ADMIN.PRODUCTS.EDIT(productId),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);



// Delete a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(endPoints.ADMIN.PRODUCTS.DELETE(productId));
      return { productId }; 
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);


//top selling products
export const getTopSellingProducts = createAsyncThunk(
  'products/getTopSellingProducts', async(__dirname,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endPoints.ADMIN.STATISTICS.GET_TOP_SELLING_PRODUCTS);
      return response.data
    } catch (error) {
      return rejectWithValue(handleError(error))
    }
  }
)

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, total, pages, currentPage, totalCatProducts, totalDogProducts } = action.payload;
        state.loading = false;
        if (currentPage === 1) {
          state.products = products; 
        } else {
          state.products = [...state.products, ...products];
        }

        state.total = total
        state.totalCatProducts = totalCatProducts
        state.totalDogProducts = totalDogProducts
        state.pages = pages;
        state.currentPage = currentPage;
        state.hasMore = currentPage < pages;

        state.error = null;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.product);
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Product
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
      
        // Check if the payload has the expected structure
        if (updatedProduct && updatedProduct.id) {
          const index = state.products.findIndex((p) => p.id === updatedProduct.id);
          if (index !== -1) {
            // Update the product in the state
            state.products[index] = { ...state.products[index], ...updatedProduct };
          }
        } else {
          console.error('Invalid payload structure:', action.payload);
        }
      
        state.error = null;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload.productId
        );
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //top selling products
      .addCase(getTopSellingProducts.fulfilled, (state, action) => {
        state.topSellingProducts = action.payload.data        
      })
  },
});

export const { setCategory } = productSlice.actions;

export default productSlice.reducer;
