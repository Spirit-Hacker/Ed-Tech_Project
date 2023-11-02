import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice";
import profileSlice from "../slice/profileSlice";
import cartSlice from "../slice/cartSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    profile: profileSlice,
    cart: cartSlice,
})

export default rootReducer