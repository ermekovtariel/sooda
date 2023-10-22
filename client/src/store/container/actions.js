import { createAsyncThunk } from "@reduxjs/toolkit"

export const getContainers = createAsyncThunk("/getContainers", async (data) => data)
export const addContainer = createAsyncThunk("/addContainer", async (data) => data)
export const deleteContainer = createAsyncThunk("/deleteContainer", async (data) => data)


