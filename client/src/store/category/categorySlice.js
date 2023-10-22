import { createSlice } from "@reduxjs/toolkit"
import { addCategory, getCategories, getProductCategories } from "./actions"

const initialState = {
	data: [],
	productCategories: [],
}

export const busketSlice = createSlice({
	name: "busketSlice",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(getCategories.fulfilled, (state, { payload }) => {
			state.data = payload
		})
		builder.addCase(addCategory.fulfilled, (state, { payload }) => {
			state.data.push(payload)
		})
		builder.addCase(getProductCategories.fulfilled, (state, { payload }) => {
			state.productCategories = payload
		})
	}
})

export default busketSlice.reducer
