// src/features/dashboard/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";






const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    graph:{},
  },
  reducers: {
    setGraph: (state, action) => { 

      state.graph = action.payload;
    },
  },
  
});

export const { setGraph } = dashboardSlice.actions;
export default dashboardSlice.reducer;
