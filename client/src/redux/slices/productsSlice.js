// src/features/products/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const productsSlice = createSlice({
  name: "products", 
  initialState: {
    productID:"",
    topProducts:[],
  },
  reducers: {
    setProductID:(state,action)=>{
       state.productID=action.payload;
    },
    setTopProducts:(state,action)=>{
      state.topProducts=action.payload;
    }
  },
  
});
export const {setProductID,setTopProducts}=productsSlice.actions;
export default productsSlice.reducer;
