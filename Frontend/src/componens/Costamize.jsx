import React, { useState } from "react";
import Card from "./Card";
import img from "../assets/cool-gaming-pictures.jpg";
import bg from "../assets/bg.png";
import bg2 from "../assets/bg2.jpg";
import { LuImageDown } from "react-icons/lu";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { selectImage } from "../redux/selectedImageSlice";
import { useNavigate } from "react-router-dom";

function Costamize() {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [err, setErr] = useState("");
    const selecter = useSelector((state) => state.selectedImage?.image);
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const handleImageChange = (e) => {
        try {
            const selectedFile = e.target.files[0];
            if (!selectedFile) return;
            dispatch(selectImage(selectedFile));
            setErr("");
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
        } catch (error) {
            console.error("Error loading image:", error);
            setErr("Failed to load image. Please try again.");
        }
    };

    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-blue-900 to-black flex flex-col gap-2 justify-center items-center">
            <h1 className="text-white text-2xl font-bold mb-6">Customize Your bg</h1>
            <div className="w-[90%] max-w-[800px] flex flex-wrap items-center justify-center gap-4">
                <Card image={img} />
                <Card image={img} />
                <Card image={img} />
                <Card image={bg} />
                <Card image={bg2} />

                {/* Upload Box */}
                <div
                    className={`w-[100px] h-[80px] sm:w-[200px] sm:h-[150px] bg-black border-2 flex flex-col items-center justify-center border-blue-300 rounded-xl overflow-hidden 
                    hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-white`}

                >
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        onChange={handleImageChange}
                    />
                    <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full h-full cursor-pointer"
                    >
                        {!image ? (
                            <LuImageDown className="text-2xl text-white mb-2" />
                        ) : (
                            <img
                                src={image}
                                alt="Uploaded"
                                className="h-full w-full object-cover"
                            />
                        )}
                    </label>
                </div>

                {err && (
                    <div className="w-full max-w-[400px] text-red-500 text-center mt-2">
                        {err}
                    </div>
                )}
            </div>
            {selecter && (
            <Button className="text-black font-semibold bg-white h-[40px]  px-5  rounded-2xl mt-2 cursor-pointer "
            onClick={() => navigator("/costamixe")}
            >
                Next
            </Button>
            )}
        </div>
    );
}

export default Costamize;
