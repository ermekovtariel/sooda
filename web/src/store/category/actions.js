import { createAsyncThunk } from "@reduxjs/toolkit"
import { isEmpty, propOr } from "ramda"

export const getCategories = createAsyncThunk("/getCategories", async (data) => {
    return data.map(item =>
        item.hasChildren && isEmpty(propOr([], "children", item))
            ? ({ ...item, children: [] })
            : item).map(item => ({ ...item, key: item._id }))
})
export const addCategory = createAsyncThunk("/addCategory", async (data) => data)
export const getProductCategories = createAsyncThunk("/getProductCategories", async (data) => data)
export const getCategoryChilds = createAsyncThunk("/getCategoryChilds", async (data) => data)
