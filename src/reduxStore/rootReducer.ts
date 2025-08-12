import { combineReducers } from "@reduxjs/toolkit";
import { signInByPasswordReducer } from "./signin-request-by-password/sliceReducer";
import { userSignUpReducer } from "./signup-request/sliceReducer";
import { detectFigmaFileKeyReducer } from "./figma/slideReducer";


const rootReducer = combineReducers({
  signInByPasswordReducer,
  userSignUpReducer,
  detectFigmaFileKeyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
