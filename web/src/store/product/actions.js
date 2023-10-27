import { createAsyncThunk } from "@reduxjs/toolkit"

export const getHomeProducts = createAsyncThunk("/getHomeProducts", async (data) => data)
export const getOwnProducts = createAsyncThunk("/getOwnProducts", async (data) => data)
export const addOwnProduct = createAsyncThunk("/addOwnProduct", async (data) => data)
export const deleteOwnProduct = createAsyncThunk("/deleteOwnProduct", async (data) => data)
export const getOneCard = createAsyncThunk("/getOneCard", async (data) => data)
export const getSearch = createAsyncThunk("/getSearch", async (data) => data)
export const productSearching = createAsyncThunk("/productSearching", async (data) => data)
export const categoryProductsLoading = createAsyncThunk("/categoryProductsLoading", async (data) => data)
export const getCategoryProducts = createAsyncThunk("/getCategoryProducts", async (data) => data)