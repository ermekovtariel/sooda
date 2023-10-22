import { createSlice } from "@reduxjs/toolkit"
import {
	addOwnProduct,
	categoryProductsLoading,
	deleteOwnProduct,
	getCategoryProducts,
	getHomeProducts,
	getOneCard,
	getOwnProducts,
	getSearch,
	productSearching
} from "./actions"

const initialState = {
	homeProducts: {
		data: [],
	},
	ownProducts: {
		data: [],
	},
	basketProducts: {
		data: [],
	},
	search: {
		data: [],
		isLoading: false
	},
	productData: {
		image: [],
		count: 0,
		date: null,
		description: "",
		name: "",
		owner: null,
		price: 0,
		_id: null,
	},
	category: {
		data: {
			products: [],
			category: {}
		},
		isLoading: false,
	}
}

export const productSlice = createSlice({
	name: "productSlice",
	initialState,
	reducers: {},
	extraReducers: builder => {
		//! FULL PRODUCTS
		builder.addCase(getHomeProducts.fulfilled, (state, { payload }) => {
			state.homeProducts.data = payload
		})

		builder.addCase(getOwnProducts.fulfilled, (state, { payload }) => {
			state.ownProducts.data = payload
		})

		builder.addCase(addOwnProduct.fulfilled, (state, { payload }) => {
			state.ownProducts.data.push(payload)
		})

		builder.addCase(deleteOwnProduct.fulfilled, (state, { payload }) => {
			state.ownProducts.data = payload
		})
		builder.addCase(getOneCard.fulfilled, (state, { payload }) => {
			state.productData = payload
		})

		builder.addCase(getSearch.fulfilled, (state, { payload }) => {
			state.search.data = payload
		})

		builder.addCase(productSearching.fulfilled, (state, { payload }) => {
			state.search.isLoading = payload
		})

		builder.addCase(categoryProductsLoading.fulfilled, (state, { payload }) => {
			state.category.isLoading = payload
		})

		builder.addCase(getCategoryProducts.fulfilled, (state, { payload }) => {
			state.category.data = payload
		})


	}
})

export default productSlice.reducer
