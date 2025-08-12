export interface RequestState {
    request: RequestStatus;
    loading: boolean;
  }
  
  export enum RequestStatus {
    idle = "idle",
    requesting = "requesting",
    failed = "failed",
    success = "success",
  }
  
  export enum ACTION_TYPE {
    POST_SIGNIN_PASSWORD = "POST_SIGNIN_PASSWORD",
    POST_SIGNIN_GOOGLE = "POST_SIGNIN_GOOGLE",
    POST_SIGN_UP = "POST_SIGN_UP",
    GET_DETECT_FIGMA_FILE_KEY = "GET_DETECT_FIGMA_FILE_KEY",
    POST_DETECT_FIGMA_FILE_KEY = "POST_DETECT_FIGMA_FILE_KEY"
  }
  