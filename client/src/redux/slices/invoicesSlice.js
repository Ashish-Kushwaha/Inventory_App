// src/features/invoices/invoicesSlice.js
import { createSlice } from "@reduxjs/toolkit";




const invoicesSlice = createSlice({
  name: "invoices",
  initialState: {
    invoiceID:"",
    invoiceProducts:[],
    invoiceAmount:0,
    invoiceReference:"",
    dueDate:"",
    invId:"",
  },
  reducers: {
    setInvoiceID:(state,action)=>{
      state.invoiceID=action.payload
    },
    setInvoiceProducts:(state,action)=>{
      state.invoiceProducts=action.payload
    },
    setInvoiceAmount:(state,action)=>{
      state.invoiceAmount=action.payload
    },
    setInvoiceReference:(state,action)=>{
      state.invoiceReference=action.payload
    },
    setDueDate:(state,action)=>{
      state.dueDate=action.payload
    },
    setInvId:(state,action)=>{
      state.invId=action.payload
    }
  },
  
});
export const {setInvoiceID,setInvoiceProducts,setInvoiceAmount,setInvoiceReference,setDueDate,setInvId}=invoicesSlice.actions;

export default invoicesSlice.reducer;
