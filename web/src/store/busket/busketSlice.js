import { createSlice } from "@reduxjs/toolkit"
import { changeItemeBusket, changeParams, getBuskets } from "./actions"

const initialState = {
	data: [],
	count: 0,
	rerender: 0
}

export const busketSlice = createSlice({
	name: "busketSlice",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(getBuskets.fulfilled, (state, { payload }) => {
			state.data = payload
			state.count = payload.length
		})
		builder.addCase(changeItemeBusket.fulfilled, (state, { payload }) => {
			state.rerender = payload
		})
		builder.addCase(changeParams.fulfilled, (state, { payload }) => {
			state.data = payload
			state.count = payload.length
		})
	}
})

export default busketSlice.reducer
