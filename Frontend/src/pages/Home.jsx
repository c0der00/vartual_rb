import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import newRequest from "../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../redux/authSlice";

function Home(){

    const navigator = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const selectedUser = useSelector((state) => state.auth);
   
    const fetchGaminiResponse = async (prompt) => {
        const response = await newRequest.post("api/v1/gamini",{
          prompt,
          assistentName: selectedUser.userData?.data?.assistentName,
          name : selectedUser.userData?.data?.name
        })
        console.log("Gamini Response:", response.data);
        return response.data;
      }
    
     
    useEffect(() => {
        const fetchData = async () => {
            const response = await newRequest.get("/api/v1/users/current");
            if (response) {
                console.log("Current user data:", response.data); 
                setUser(response.data);
            }
            dispatch(login({
                userData: response.data,
            }));
        }
        fetchData();
    },[dispatch])

    
      
    useEffect(() => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous= true;
      recognition.lang = "en-US";
      
      recognition.onresult = async(event) => {
        console.log(event);
        const transcript = event?.results[event.results.length-1][0]?.transcript.replace(".","").trim();
        console.log("Transcript:", transcript);
        
        if (transcript.toLowerCase().includes(selectedUser.userData?.data?.name.toLowerCase())) {
        const responseGamini = await fetchGaminiResponse(transcript);
        console.log(responseGamini);
        
        }

      }

      recognition.start();

      
    },[])

    
 
 

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