import {createApi} from "@reduxjs/toolkit/dist/query/react"

// import API from "root/js/api"

import apiFunctions from "./apiFunctions"

// const WBAPI = new API()

const WBAPIBaseQuery =
	() =>
	async ({params}) => {
		try {
			return {params}
		} catch (error) {
			console.log({error})
			return {
				error,
			}
		}
	}

export const WBapi = createApi({
	reducerPath: "WBAPI",
	baseQuery: WBAPIBaseQuery(),
	tagTypes: ["Data"],
	endpoints: build => ({
		getData: build.query({
			query: ({params}) => ({apiMethod: apiFunctions.getData, params}),
			providesTags: () => ["Data"],
		})
	}),
})
