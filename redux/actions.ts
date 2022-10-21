import { initState } from "./reducer"

const actions = {
  SETACCESSTOKEN: "SETACCESSTOKEN",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  SETNAVBARVISIBILITY: "SETNAVBARVISIBILITY",
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

export function setNavbarVisibility(navbarVisibility: boolean) {
  return { type: actions.SETNAVBARVISIBILITY, navbarVisibility }
}

export default actions