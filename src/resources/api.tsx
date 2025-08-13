import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";
import { isBrowser } from "../utils/isBrowser";

export interface QueryParams {
  [key: string]: string | number | undefined;
}

export class Api {
  protected baseUrl: string | undefined;
  protected apiKey: string | undefined ;
  constructor(baseUrl?: string , apiKey? :string ) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
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
        'x-api-key': this.apiKey,
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

  public setTokensFromResponse(response: AxiosResponse): string | null {
    if (!response || !response.headers) return null;

    const accessToken = response.headers["accesstoken"] as string | undefined;
    const refreshToken = response.headers["refreshtoken"] as string | undefined;

    if (accessToken) {
      this.setAccessToken(accessToken);
    }
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }

    return accessToken ?? null;
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

  public clearTokens(): void {
    if (isBrowser()) {
      window.localStorage.removeItem(ACCESS_TOKEN);
      window.localStorage.removeItem(REFRESH_TOKEN);
    }
  }
}