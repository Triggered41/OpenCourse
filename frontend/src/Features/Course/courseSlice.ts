import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
    name: 'course',
    initialState: { value: [] },
    reducers: {
        setChapters: (state: any, action: PayloadAction<Array<any>>) => {
            console.log("Rec Ch: ", action.payload)
            state.value = action.payload
        }
    }

})
export const { setChapters } = courseSlice.actions
export default courseSlice.reducer