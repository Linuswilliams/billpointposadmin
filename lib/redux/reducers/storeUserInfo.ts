import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface storeUserInfo {
  user: any,
  userForgottenEmail: string;
  userOtpId: string;
}

const initialState: storeUserInfo = {
  user: null,
  userForgottenEmail:'',
  userOtpId: ''
}

export const storeUserInfoSlice = createSlice({
  name: 'user info',
  initialState,
  reducers: {
    getUserInfo: (state, action: PayloadAction<object>) => {
        state.user = action.payload
    },
    getUserForgottenEmail: (state, action: PayloadAction<string>) => {
        state.userForgottenEmail = action.payload
    },
    getUserOtpId: (state, action: PayloadAction<string>) => {
        state.userOtpId = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { getUserInfo, getUserForgottenEmail, getUserOtpId } = storeUserInfoSlice.actions

export default storeUserInfoSlice.reducer