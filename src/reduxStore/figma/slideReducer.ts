import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";
import { RequestState, RequestStatus } from "../types";
import { postDetectFigmaFileKey, getDetectFigmaFileKey } from "./action";

export interface DetectFigmaFileKeyState extends RequestState {
  data: any;
  loading: boolean;
}

export const initialState: DetectFigmaFileKeyState = {
  request: RequestStatus.idle,
  loading: false,
  data: {},
};

export const detectFigmaFileKeySlice = createSlice({
  name: "detectFigmaFileKey",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // POST
    builder.addCase(postDetectFigmaFileKey.pending, (state) => {
      state.request = RequestStatus.requesting;
      state.loading = true;
    });
    builder.addCase(postDetectFigmaFileKey.fulfilled, (state, { payload }) => {
      state.request = RequestStatus.success;
      state.loading = false;
      state.data = payload;
    });
    builder.addCase(postDetectFigmaFileKey.rejected, (state) => {
      state.request = RequestStatus.failed;
      state.loading = false;
    });

    // GET
    builder.addCase(getDetectFigmaFileKey.pending, (state) => {
      state.request = RequestStatus.requesting;
      state.loading = true;
    });
    builder.addCase(getDetectFigmaFileKey.fulfilled, (state, { payload }) => {
      state.request = RequestStatus.success;
      state.loading = false;
      state.data = payload;
    });
    builder.addCase(getDetectFigmaFileKey.rejected, (state) => {
      state.request = RequestStatus.failed;
      state.loading = false;
    });
  },
});

export const detectFigmaFileKeyReducer = detectFigmaFileKeySlice.reducer;
export const detectFigmaFileKeySelector = (state: RootState) =>
  state.detectFigmaFileKeyReducer;
