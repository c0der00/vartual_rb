import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import newRequest from "../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

function Home(){

    const navigator = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await newRequest.get("/api/v1/users/current");
            if (response) {
                console.log("Current user data:", response.data);
                setUser(response.data);
            }
            
        }
        fetchData();
    },[dispatch])

return(
 <div
  className={`w-full h-[100vh] flex flex-col gap-6 justify-center items-center text-shadow-black ${
    user?.data?.assistantImage ? "bg-cover bg-center" : "bg-black"
  }`}
  style={
    user?.data?.assistantImage
      ? { backgroundImage: `url(${user.data.assistantImage})` }
      : {}
  }
>
  <h1 className="text-3xl font-bold text-white">Welcome to the Home Page</h1>
    <p className="text-lg text-white">
        {user ? ` ${user.data.assistantName || "User"}!` : "Loading..."}
    </p>
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    onClick={async () => {
      await newRequest.post("/api/v1/users/logout", {}, { withCredentials: true });
      console.log("Logging out...");
      dispatch(logout());
      navigator("/signin");
      setUser(null);
    }}
  >
    logout
  </button>
</div>

)
}

export default Home