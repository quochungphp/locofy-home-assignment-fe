/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";
import { RequestState, RequestStatus } from "../types";
import { UserResponseDto } from "../../domain";
import { postSignInByPassword } from "./action";

export interface SignInByPasswordState extends RequestState {
  data: UserResponseDto;
  loading: boolean;
  isAuth: boolean,

}

export const initialState: SignInByPasswordState = {
  request: RequestStatus.idle,
  loading: false,
  data: <UserResponseDto>{},
  isAuth: false
};

export const signInByPasswordSlice = createSlice({
  name: "signInByPassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postSignInByPassword.pending, (state) => {
      state.request = RequestStatus.requesting;
      state.loading = true;
    });
    builder.addCase(postSignInByPassword.fulfilled, (state, { payload }) => {
      state.request = RequestStatus.success;
      state.loading = false;
      state.data = payload;
      if (payload.status && payload.status === 'success') {
        state.isAuth = true
      } else {
        state.isAuth = false
      }      
    });
    builder.addCase(postSignInByPassword.rejected, (state) => {
      state.request = RequestStatus.failed;
      state.loading = false;
    });
  },
});

export const signInByPasswordReducer = signInByPasswordSlice.reducer;
export const signInByPasswordSelector = (state: RootState) =>
  state.signInByPasswordReducer;
