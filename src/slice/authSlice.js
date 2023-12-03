import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
<<<<<<< HEAD
=======
    signupData: null,
    loading: false,
>>>>>>> 20e4c08 (hooks, login signup logic, all api, utils)
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
<<<<<<< HEAD
=======
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
>>>>>>> 20e4c08 (hooks, login signup logic, all api, utils)
        setToken(state, value){
            state.token = value.payload
        },
    }
})

<<<<<<< HEAD
export const { setToken } = authSlice.actions;
=======
export const { setToken, setLoading, setSignupData } = authSlice.actions;
>>>>>>> 20e4c08 (hooks, login signup logic, all api, utils)
export default authSlice.reducer;