import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist"
import persistReducer from "redux-persist/es/persistReducer"
import storage from "redux-persist/lib/storage"
import { WBapi } from "../services/WBapi"

import authSlice from "./auth/authSlice"
import productSlice from "./product/productSlice"
import containerSlice from "./container/containerSlice"
import busketSlice from "./busket/busketSlice"
import categorySlice from "./category/categorySlice"

const rootReducer = combineReducers({
	auth: authSlice,
	product: productSlice,
	containers: containerSlice,
	busket: busketSlice,
	categories: categorySlice
})

const persistConfig = {
	key: "SOODA",
	storage,
	whitelist: ["settingsColumns"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const setupStore = () => {
	return configureStore({
		reducer: persistedReducer,
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [
						FLUSH,
						REHYDRATE,
						PAUSE,
						PERSIST,
						PURGE,
						REGISTER,
						"userTariff/setUserTariff",
					],
					ignoredActionsPaths: ["userTariff.tariffExpiration", "payload.error"],
				},
			}).concat(WBapi.middleware),
	})
}
