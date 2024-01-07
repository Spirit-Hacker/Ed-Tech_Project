import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice";
import profileSlice from "../slice/profileSlice";
import cartSlice from "../slice/cartSlice";
import courseSlice from "../slice/courseSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    profile: profileSlice,
    cart: cartSlice,
    course: courseSlice
})

export default rootReducer