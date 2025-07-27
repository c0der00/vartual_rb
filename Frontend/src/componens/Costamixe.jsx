import React, { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function Costamixe() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-900 to-black flex items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/");
        }}
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
      </form>
    </div>
  );
}

export default Costamixe;
