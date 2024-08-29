// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import familyReducer from "./features/familySlice";
import leftSidebarReducer from "./features/leftSidebarSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    family: familyReducer,
    leftSidebar: leftSidebarReducer,
  },
});

export default store;
