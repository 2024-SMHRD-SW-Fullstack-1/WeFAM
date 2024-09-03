import { createSlice } from "@reduxjs/toolkit";

const pollsSlice = createSlice({
  name: "polls",
  initialState: {
    polls: [],
  },
  reducers: {
    addPoll: (state, action) => {
      state.polls.push(action.payload);
    },
  },
});

export const { addPoll } = pollsSlice.actions;
export default pollsSlice.reducer;
