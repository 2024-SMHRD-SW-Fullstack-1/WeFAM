import { createSlice } from "@reduxjs/toolkit";

const familySlice = createSlice({
  name: "family",
  initialState: {
    familyData: null,
  },
  reducers: {
    setFamilyData: (state, action) => {
      state.familyData = action.payload;
    },
  },
});

export const { setFamilyData } = familySlice.actions;

export default familySlice.reducer;
