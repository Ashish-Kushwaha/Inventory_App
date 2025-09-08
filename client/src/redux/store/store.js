import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import productsReducer from "../slices/productsSlice";
import statisticsReducer from "../slices/statisticsSlice";
import dashboardReducer from "../slices/dashboardSlice";
import invoicesReducer from "../slices/invoicesSlice"; 

import modalReducer from "../slices/modalSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer, 
    statistics: statisticsReducer,
    dashboard: dashboardReducer,
    invoices: invoicesReducer,
    modal:modalReducer
  },
});