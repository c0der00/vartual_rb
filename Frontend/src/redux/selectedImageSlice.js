import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    image: null,
}

const selectedImageSlice = createSlice({
  name: "selectedImage",
  initialState: initialState,
  reducers: {
    selectImage: (state, action) => {
            state.image =  action.payload;
        },
  },
});

export const { selectImage } = selectedImageSlice.actions;
export default selectedImageSlice.reducer;
