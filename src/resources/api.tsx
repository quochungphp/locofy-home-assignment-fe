import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";
import { isBrowser } from "../utils/isBrowser";

export interface QueryParams {
  [key: string]: string | number | undefined;
}

export class Api {
  baseUrl = process.env.REACT_APP_BACKEND_URL_BASE;
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
    this.attachTokenFromStorage();
  }

  bearer: string | null = null;
  headers: AxiosRequestHeaders = {} as any;

  setHeaders(headers: AxiosRequestHeaders) {
    this.headers = headers;
  }

  getHeaders(): AxiosRequestHeaders {
    const token = this.getAccessToken();
    if (token) {
      return {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      } as any;
    }
    return this.headers;
  }

  setAuth(bearer: string) {
    this.bearer = bearer;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  async get(url: string, query?: QueryParams) {
    const result = await axios
      .get(this.baseUrl + url, {
        params: query,
        headers: this.getHeaders(),
      })
      .catch((error: any) => Promise.resolve(error.response));
    return result;
  }

  async put(url: string, data?: any) {
    const result = await axios
      .put(this.baseUrl + url, data, {
        headers: this.getHeaders(),
      })
      .catch((error: any) => Promise.resolve(error.response));
    return result;
  }

  async post(url: string, data?: any) {
    const result = await axios
      .post(this.baseUrl + url, data, {
        headers: this.getHeaders(),
      })
      .catch((error: any) => Promise.resolve(error.response));
    return result;
  }

  async delete(url: string, query?: QueryParams) {
    const result = await axios
      .delete(this.baseUrl + url, {
        params: query,
        headers: this.getHeaders(),
      })
      .catch((error: any) => Promise.resolve(error.response));
    return result;
  }

  public getAccessToken(): string {
    if (isBrowser()) {
      return this.localStorage.getItem(ACCESS_TOKEN) || "";
    }
    return "";
  }

  get localStorage(): Storage {
    return window.localStorage;
  }

  public setAccessToken(token: string): void {
    if (isBrowser()) {
      this.localStorage.setItem(ACCESS_TOKEN, token);
    }
  }

  public setRefreshToken(token: string): void {
    if (isBrowser()) {
      this.localStorage.setItem(REFRESH_TOKEN, token);
    }
  }

  public setTokensFromResponse(response: AxiosResponse): string {
    const accessToken =
      response.headers.accesstoken || response.headers.accessToken;
    if (accessToken) {
      this.setAccessToken(accessToken);
    }

    const refreshToken =
      response.headers.refreshtoken || response.headers.RefreshToken;
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }

    return accessToken;
  }

  private attachTokenFromStorage(): void {
    const token = this.getAccessToken();
    if (token) {
      this.setHeaders({
        ...this.headers,
        Authorization: `Bearer ${token}`,
      } as any);
    }
  }
}