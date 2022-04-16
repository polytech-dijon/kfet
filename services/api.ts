import { store } from '../redux/store'
import { logout } from '../redux/actions'
import type { ApiRequest, ApiResponseSuccess, ApiResponseError, ApiResponse } from '../types/api'

export enum ApiCode {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  INVALID_TOKEN = "INVALID_TOKEN",
  NOT_ALLOWED = "NOT_ALLOWED",
}

const apiURL = process.env.NEXT_PUBLIC_APP_BASE_URL || ""

class Api {

  private token: string | null

  constructor() {
    this.token = null
  }

  getToken() {
    return this.token
  }

  setToken(token: string | null) {
    this.token = token
  }

  private headersWithToken(headersInit: HeadersInit = {}) {
    if (this.token) {
      return {
        ...headersInit,
        Authorization: `JWT ${this.token}`,
      }
    }
    else
      return headersInit
  }

  private handleError(res: ApiResponseError, reject: (reason?: any) => void) {
    if (res.code === ApiCode.INVALID_TOKEN) {
      this.setToken(null)
      store.dispatch(logout())
    }
    reject(res)
  }

  get<T = any>(path: string): Promise<ApiResponseSuccess<T>> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${apiURL}${path}`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
          headers: this.headersWithToken({ "Content-Type": "application/json" }),
        })

        const res: ApiResponse = await response.json()
        if (res.ok)
          resolve(res as ApiResponseSuccess)
        else
          this.handleError(res as ApiResponseError, reject)
      } catch (e: any) {
        console.log("CATCH IN API")
        reject({
          ok: false,
          code: ApiCode.UNKNOWN_ERROR,
          error: e.message,
        })
      }
    })
  }

  put<T = any, U = ApiRequest<any>>(path: string, body: string | U): Promise<ApiResponseSuccess<T>> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${apiURL}${path}`, {
          mode: "cors",
          method: "PUT",
          credentials: "include",
          headers: this.headersWithToken({ "Content-Type": "application/json" }),
          body: typeof body === "string" ? body : JSON.stringify(body),
        })

        const res: ApiResponse = await response.json()
        if (res.ok)
          resolve(res as ApiResponseSuccess)
        else
          this.handleError(res as ApiResponseError, reject)
      } catch (e: any) {
        reject({
          ok: false,
          code: ApiCode.UNKNOWN_ERROR,
          error: e.message,
        })
      }
    })
  }

  putFormData<T = any, U = ApiRequest<any>>(path: string, body: string | U, files: any[]): Promise<ApiResponseSuccess<T>> {
    let formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i], files[i].name)
    }
    formData.append("body", JSON.stringify(body))

    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${apiURL}${path}`, {
          mode: "cors",
          method: "PUT",
          credentials: "include",
          headers: this.headersWithToken(),
          body: formData,
        })

        const res: ApiResponse = await response.json()
        if (res.ok)
          resolve(res as ApiResponseSuccess)
        else
          this.handleError(res as ApiResponseError, reject)
      } catch (e: any) {
        reject({
          ok: false,
          code: ApiCode.UNKNOWN_ERROR,
          error: e.message,
        })
      }
    })
  }

  postFormData<T = any, U = ApiRequest<any>>(path: string, body: string | U, files: any[]): Promise<ApiResponseSuccess<T>> {
    let formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i], files[i].name)
    }
    formData.append("body", JSON.stringify(body))

    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${apiURL}${path}`, {
          mode: "cors",
          method: "POST",
          credentials: "include",
          headers: this.headersWithToken(),
          body: formData,
        })

        const res: ApiResponse = await response.json()
        if (res.ok)
          resolve(res as ApiResponseSuccess)
        else
          this.handleError(res as ApiResponseError, reject)
      } catch (e: any) {
        reject({
          ok: false,
          code: ApiCode.UNKNOWN_ERROR,
          error: e.message,
        })
      }
    })
  }

  remove<T = any, U = ApiRequest<any>>(path: string, body?: string | U): Promise<ApiResponseSuccess<T>> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${apiURL}${path}`, {
          mode: "cors",
          credentials: "include",
          method: "DELETE",
          headers: this.headersWithToken({ "Content-Type": "application/json" }),
          ...(body !== undefined ? {
            body: typeof body === "string" ? body : JSON.stringify(body),
          } : {})
        })

        const res: ApiResponse = await response.json()
        if (res.ok)
          resolve(res as ApiResponseSuccess)
        else
          this.handleError(res as ApiResponseError, reject)
      } catch (e: any) {
        reject({
          ok: false,
          code: ApiCode.UNKNOWN_ERROR,
          error: e.message,
        })
      }
    })
  }

  post<T = any, U = ApiRequest<any>>(path: string, body: string | U): Promise<ApiResponseSuccess<T>> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${apiURL}${path}`, {
          mode: "cors",
          method: "POST",
          credentials: "include",
          headers: this.headersWithToken({ "Content-Type": "application/json" }),
          body: typeof body === "string" ? body : JSON.stringify(body),
        })

        const res: ApiResponse = await response.json()
        if (res.ok && response.status >= 200 && response.status < 400)
          resolve(res as ApiResponseSuccess)
        else
          this.handleError(res as ApiResponseError, reject)
      } catch (e: any) {
        reject({
          ok: false,
          code: ApiCode.UNKNOWN_ERROR,
          error: e.message,
        })
      }
    })
  }

}

const API = new Api()
export default API