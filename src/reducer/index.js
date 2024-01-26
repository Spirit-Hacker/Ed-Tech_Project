import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice";
import profileSlice from "../slice/profileSlice";
import cartSlice from "../slice/cartSlice";
import courseSlice from "../slice/courseSlice";
import viewCourseSlice from "../slice/viewCourseSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    profile: profileSlice,
    cart: cartSlice,
    course: courseSlice,
    viewCourse: viewCourseSlice
})

export default rootReducer