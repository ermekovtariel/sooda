import { createSlice } from "@reduxjs/toolkit"

import { addContainer, deleteContainer, getContainers } from "./actions"

const initialState = {
	container: {
		data: []
	}
}

export const containerSlice = createSlice({
	name: "containerSlice",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(getContainers.fulfilled, (state, { payload }) => {
			state.container.data = payload
		})
		builder.addCase(addContainer.fulfilled, (state, { payload }) => {
			state.container.data.push(payload)
		})
		builder.addCase(deleteContainer.fulfilled, (state, { payload }) => {
			state.container.data = payload
		})

	}
})

export default containerSlice.reducer
