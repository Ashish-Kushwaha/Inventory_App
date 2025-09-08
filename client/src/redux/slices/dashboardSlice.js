// src/features/dashboard/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "/api/dashboard";





const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    graph:{},
  },
  reducers: {
    setGraph: (state, action) => { 
      // console.log(action.payload)
      state.graph = action.payload;
    },
  },
  
});

export const { setGraph } = dashboardSlice.actions;
export default dashboardSlice.reducer;
