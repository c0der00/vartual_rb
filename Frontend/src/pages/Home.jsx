import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import newRequest from "../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

function Home(){

    const navigator = useNavigate();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await newRequest.get("/api/v1/users/current");
    //         if (response) {
    //             console.log("Current user data:", response.data);
    //             dispatch(loginSuccess(response.data));
    //         }
    //     }
    //     fetchData();
    // },[dispatch])

return(
    <div className="text-shadow-black">
        hii home
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={async() => {
            await newRequest.post("/api/v1/users/logout",{},{ withCredentials: true })
            console.log("Logging out...");
            // Optionally, you can dispatch a logout action here if you have one
            dispatch(logout());
            navigator("/signin");

        }}>
            logout
        </button>
    </div>
)
}

export default Home