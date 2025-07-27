import React, { useState } from "react";
import bg from '../assets/bg.png';
import { useNavigate } from "react-router-dom";
import { Button } from "../componens/ui/button";
import newRequest from "../utils/newRequest";
import { useDispatch } from "react-redux";
import { login, loginFailure, loginStart} from "../redux/authSlice";

function Signin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart());
    setErr("");
    try {
      const response = await newRequest.post("/api/v1/users/login", { name, email, password }, { withCredentials: true });

      if (response) {
        console.log(response.data);
        dispatch(login(response.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error.response?.data);
      dispatch(loginFailure(error.response?.data || "Something went wrong"));
      setErr(error.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[500px] rounded-sm max-w-[450px] backdrop-blur-lg bg-[#000000090] px-[20px] shadow-lg shadow-blue-700 flex flex-col gap-6 justify-center items-center"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white h-[20px] font-semibold mb-[2px]">
          Login to <span className="text-blue-400">Vartual</span>
        </h1>
        <input
          className="w-full h-[60px] border-2 border-white outline-none rounded-full px-[20px] py-[10px] placeholder-gray-500 text-white text-[15px]"
          type="text"
          required
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          className="w-full h-[60px] border-2 border-white outline-none rounded-full px-[20px] py-[10px] placeholder-gray-500 text-white text-[15px]"
          type="email"
          required
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          className="w-full h-[60px] border-2 border-white outline-none rounded-full px-[20px] py-[10px] placeholder-gray-500 text-white text-[15px]"
          type="password"
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Button
          className="w-[140px] h-[56px] font-semibold mt-1 border-2 rounded-full bg-white"
          disabled={loading}
        >
          {loading ? "Loading..." : "Signin"}
        </Button>
        {err && (
          <div className="flex max-w-[400px] flex-wrap overflow-hidden">
            <p className="text-red-400">{err}</p>
          </div>
        )}
        <p className="text-white text-[17px] cursor-pointer">
          Already have an account?
          <span onClick={() => navigate("/signup")} className="text-blue-400 ml-2">
            singup
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signin;
