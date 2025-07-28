import React, { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import  newRequest from "../utils/newRequest";

function Costamixe() {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const selectedImage = useSelector((state) => state.selectedImage?.image);

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
      const formadata = new FormData();
      formadata.append("assistantName", name);
      formadata.append("assistantImage", selectedImage);
  
      const response = await newRequest.post("/api/v1/users/update",formadata,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        setErr("");
        navigate("/");
      }
  
       

      
    } catch (error) {
      console.log("Error creating assistant:", error); 
      setErr(error?.response?.data|| "something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-900 to-black flex items-center justify-center px-4">
      <form
        onSubmit={ handleSubmit }
        className="w-full max-w-md p-8 rounded-2xl flex flex-col items-center gap-6  "
      >
        <h1 className="text-white text-3xl font-bold text-center">
          Enter your <span className="text-blue-400">Assistant name</span>
        </h1>

        <input
          type="text"
          required
          placeholder="Enter your assistant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 px-4 rounded-full border border-white text-white placeholder-gray-400 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <Button
          type="submit"
          className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-blue-100 transition"
        >
          Create Assistant
        </Button>
        {err && (
        <div className="w-full max-w-[600px] max-h-[100px] max-w-md text-red-500 text-center mt-4 overflow-hidden">
          {err}
        </div>
      )}
      </form>
    </div>
  );
}

export default Costamixe;
