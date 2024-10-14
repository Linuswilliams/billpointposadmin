import { combineReducers } from 'redux'
import storeUserInfo from './reducers/storeUserInfo'



export const rootReducer = combineReducers({
    user: storeUserInfo
})
