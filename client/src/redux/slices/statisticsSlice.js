// src/features/statistics/statisticsSlice.js
import { createSlice } from "@reduxjs/toolkit";


const statisticsSlice = createSlice({
  name: "statistics",
  initialState: {
    revenue: 0,
    sales: 0,
    purchases: 0,
    topProducts: [],
    graphData: [],
    loading: false,
  },
  reducers: {},
  
});

export default statisticsSlice.reducer;
