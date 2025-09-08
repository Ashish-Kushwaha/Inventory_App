import { createSlice } from "@reduxjs/toolkit";


const initialState={
    addProductModal:false,
    uploadCSVFileModal:false,
    invoiceModal:false, 
    orderModal:false,
    individualProduct:false,
    productID:"",
    invoiceProductDetails:""
}

const modalSlice=createSlice({
    name:"modal",
    initialState,
    reducers:{
        setAddProductModal:(state,action)=>{
          console.log(action.payload)
          state.addProductModal=action.payload;
        },
        setUploadCSVFileModal:(state,action)=>{
          state.uploadCSVFileModal=action.payload;
        },  
        setInvoiceModal:(state,action)=>{
          state.invoiceModal=action.payload;
        },
        setOrderModal:(state,action)=>{
          state.orderModal=action.payload;
        },
        setIndividualProduct:(state,action)=>{
          state.individualProduct=action.payload;
        },
        setProductID:(state,action)=>{
          state.productID=action.payload;
        },
        setInvoiceProductDetails:(state,action)=>{
          state.productID=action.payload;
        }
  
    }
})

export const {setAddProductModal,setUploadCSVFileModal,setInvoiceModal,setOrderModal,setIndividualProduct,setInvoiceProductDetails}=modalSlice.actions;
export default modalSlice.reducer;