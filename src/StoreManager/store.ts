import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "../Features/Course/courseSlice";

export default configureStore({
    reducer: {
        course: courseReducer
    }
})