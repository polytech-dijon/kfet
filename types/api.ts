import type { ApiCode } from '../services/api'

export interface ApiRequest<T = any> {
  data: T;
}

export interface ApiResponseSuccess<T = any> {
  ok: boolean;
  code?: never;
  error?: never;
  data: T;
}

export interface ApiResponseErrorCode {
  ok: boolean;
  code: ApiCode;
  error?: never;
  data?: never;
}
export interface ApiResponseErrorDescription {
  ok: boolean;
  code?: never;
  error: string;
  data?: never;
}
export type ApiResponseError = ApiResponseErrorCode | ApiResponseErrorDescription;

export type ApiResponse<T = any> = ApiResponseSuccess<T> | ApiResponseError