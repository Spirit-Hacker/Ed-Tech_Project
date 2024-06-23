import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  courseSectionData: localStorage.getItem("courseSectionData") ? JSON.parse(localStorage.getItem("courseSectionData")) : [],
  courseEntireData: localStorage.getItem("entireCourseData") ? JSON.parse(localStorage.getItem("entireCourseData")) : [],
  completedLectures: localStorage.getItem("completedLectures") ? JSON.parse(localStorage.getItem("completedLectures")) : [],
  totalNoOfLectures: localStorage.getItem("totalNoOfLectures") ? JSON.parse(localStorage.getItem("totalNoOfLectures")) : 0,
}

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload
    },
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload
    },
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload
    },
    setCompletedLectures: (state, action) => {
      // localStorage.setItem("completedLectures", JSON.stringify([...state.completedLectures, action.payload]))
      state.completedLectures = action.payload
    },
    updateCompletedLectures: (state, action) => {
      // localStorage.setItem("completedLectures", JSON.stringify([...state.completedLectures, action.payload]))
      state.completedLectures = [...state.completedLectures, action.payload]
    },
  },
})

export const {
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
  setCompletedLectures,
  updateCompletedLectures,
} = viewCourseSlice.actions

export default viewCourseSlice.reducer
