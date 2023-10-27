import { createAsyncThunk } from "@reduxjs/toolkit"

export const login = createAsyncThunk("/login", async (props) => props)
export const register = createAsyncThunk("/register", async (props) => props)

export const logout = createAsyncThunk("/logout", async () => {
    try {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        return true
    } catch (error) {
        console.log(error);
    }
})

