import { configureStore, Action, getDefaultMiddleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ThunkAction } from "redux-thunk";
import logger from "redux-logger";
import rootReducer, { RootState } from "./rootReducer";

const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: false,
  }),
  logger,
];
const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
