import { createSlice } from "@reduxjs/toolkit"

import { login, logout, register } from "./actions"

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState = {
	role: user && user !== "undefined" ? JSON.parse(user)?.role ?? null : null,
	user: user && user !== "undefined" ? JSON.parse(user) : null,
	token: token && token !== "undefined" ? token : null,
}

export const authSlice = createSlice({
	name: "authSlice",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(login.fulfilled, (state, { payload }) => {
			state.token = payload.token
			state.user = payload.user
			state.role = payload.user.role
		})
		builder.addCase(register.fulfilled, (state, { payload }) => {
			state.token = payload.token
			state.user = payload.user
			state.role = payload.user.role
		})
		builder.addCase(logout.fulfilled, (state) => {
			state.role = null
			state.token = null
			state.user = null
		})
	}
})

export default authSlice.reducer
