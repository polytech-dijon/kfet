import actions from "./actions"

export interface IState {
  accessToken: string | null;
}
export interface IAction extends IState {
  type: string;
}

export const initState: IState = {
  accessToken: null,
}

export default function reducer(state: IState = initState, action: IAction) {
  switch (action.type) {
    case actions.SETACCESSTOKEN:
      return { ...state, accessToken: action.accessToken }
    case actions.LOGIN:
      return { ...state, accessToken: action.accessToken }
    case actions.LOGOUT:
      return { ...state, accessToken: action.accessToken }
    default:
      return state
  }
}