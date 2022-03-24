import { createStore } from "redux"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducer from "./reducer"
import type { Reducer, Action } from "redux"
import type { IState } from "./reducer"

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer<IState>(persistConfig, reducer as Reducer<IState, Action>)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch