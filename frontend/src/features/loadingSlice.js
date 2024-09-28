import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    homeLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { homeLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
