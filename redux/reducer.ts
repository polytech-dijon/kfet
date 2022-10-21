import actions from "./actions"

export interface IState {
  accessToken: string | null;
  navbarVisibility: boolean;
}
export interface IAction extends IState {
  type: string;
}

export const initState: IState = {
  accessToken: null,
  navbarVisibility: true,
}

export default function reducer(state: IState = initState, action: IAction) {
  switch (action.type) {
    case actions.SETACCESSTOKEN:
      return { ...state, accessToken: action.accessToken }
    case actions.LOGIN:
      return { ...state, accessToken: action.accessToken }
    case actions.LOGOUT:
      return { ...state, accessToken: action.accessToken }
    case actions.SETNAVBARVISIBILITY:
      return { ...state, navbarVisibility: action.navbarVisibility }
    default:
      return state
  }
}