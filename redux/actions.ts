import { initState } from "./reducer"
import type { ThemeType } from "../utils/theme"

const actions = {
  SETTHEME: "SETTHEME",
  SETACCESSTOKEN: "SETACCESSTOKEN",
  SETUSER: "SETUSER",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
}

export function setTheme(theme: ThemeType) {
  return { type: actions.SETTHEME, theme }
}

export function setAccessToken(accessToken: string) {
  return { type: actions.SETACCESSTOKEN, accessToken }
}

export function login({ accessToken }: { accessToken: string }) {
  return { type: actions.LOGIN, accessToken }
}

export function logout() {
  const { accessToken } = initState
  return { type: actions.LOGOUT, accessToken }
}

export default actions