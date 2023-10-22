import { createAsyncThunk } from "@reduxjs/toolkit"

export const getBuskets = createAsyncThunk("/getBuskets", async (data) => data)
export const deleteItemBusket = createAsyncThunk("/deleteItemBusket", async (data) => data)
export const changeItemeBusket = createAsyncThunk("/changeItemeBusket", async (data) => data)
export const changeParams = createAsyncThunk("/changeParams", async (data) => data)


