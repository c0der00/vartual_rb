import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectImage } from "../redux/selectedImageSlice";

function Card({ image }) {
  const dispatch = useDispatch();
  const selectedImage = useSelector((state) => state.selectedImage?.image);
     
    
  return (
    <div
      className={`w-[100px] h-[80px] sm:w-[200px] sm:h-[150px] bg-black border-2 border-blue-300 rounded-xl overflow-hidden 
        hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-white
        ${selectedImage === image ? "border-white" : ""}
      `}
      onClick={() =>
        dispatch(selectImage(selectedImage === image ? null : image))
      }
    >
      <img src={image} className="h-full w-full object-cover" />
    </div>
  );
}

export default Card;
