// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import familyReducer from "./features/familySlice";
import leftSidebarReducer from "./features/leftSidebarSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";

// persist 설정
const persistConfig = {
  key: "root",
  storage,
};

// rootReducer 설정
const rootReducer = combineReducers({
  user: userReducer,
  family: familyReducer,
  leftSidebar: leftSidebarReducer,
});

// persistReducer로 감싸기
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 생성
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist와 관련된 직렬화 문제 방지
    }),
});

const persistor = persistStore(store);

export { store, persistor };