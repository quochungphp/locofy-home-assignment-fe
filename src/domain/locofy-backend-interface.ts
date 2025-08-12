export interface AuthSigninPayloadDto {
  username: string;
  password: string;
}

export enum LOGIN_PROVIDER {
  PASSWORD = "PASSWORD",
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
}

export interface UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phone: number;
  loginProvider: LOGIN_PROVIDER;
  token?: string;
  createdAt: Date;
  updatedAt?: Date;
  status?: "success" | "error";
  errors?: ErrorResponse[];
}
export interface ErrorResponse {
  code: number;
  title: string;
  detail: string;
  correlationID: string;
  timestamp: Date;
  path: string;
}

export interface UserSignUpPayloadDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: number;
}

export enum FigmaFileAction {
  Create = "create",
  Override = "override",
  Clone = "clone",
}

export interface DetectFigmaFileKeyPayload {
  url: string;
  action?: FigmaFileAction;
}

export interface FigmaFileResponseDto {
  fileKey: string;
  name: string;
  action: FigmaFileAction;
  thumbnailUrl?: string;
  rawJson?: Record<string, any>;
  version?: number;
  userId: string;
  createdAt: string;
}