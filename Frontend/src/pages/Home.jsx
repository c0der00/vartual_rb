import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import newRequest from "../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../redux/authSlice";

function Home() {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const selectedUser = useSelector((state) => state.auth);

  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognitionActiveRef = useRef(false);

  const fetchGaminiResponse = async (prompt) => {
    const response = await newRequest.post("api/v1/gamini", {
      prompt,
      assistentName: selectedUser.userData?.data?.assistentName,
      name: selectedUser.userData?.data?.name
    });
    console.log("Gamini Response:", response.data);
    return response.data;
  };

  const handleLogout = async () => {
    await newRequest.post("/api/v1/users/logout", {}, { withCredentials: true });
    console.log("Logging out...");
    dispatch(logout());
    navigator("/signin");
    setUser(null);
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (!isRecognitionActiveRef.current) {
        recognitionRef.current?.start();
      }
    };
    isSpeakingRef.current = true;
    window.speechSynthesis.speak(utterance);
  };

  const handleLink = (data) => {
    const { type, userinput, response } = data;
    speak(response);

    const query = encodeURIComponent(userinput);
    switch (type) {
      case "google-search":
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        break;
      case "calculator_open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        break;
      case "youtube_search":
      case "youtube_play":
        window.open(`https://www.youtube.com/results?search=${query}`, "_blank");
        break;
      case "instagram_open":
        window.open("https://www.instagram.com/", "_blank");
        break;
      case "facebook_open":
        window.open("https://www.facebook.com/", "_blank");
        break;
      case "weather-show":
        window.open("https://www.google.com/search?q=weather", "_blank");
        break;

      case "logout": 
        

      default:
        
        break;
    }
  };

  const handleRecognition = () => {

    const recognition = recognitionRef.current;

    if (!recognition || isSpeakingRef.current || isRecognitionActiveRef.current) {
      console.log("Recognition not started: already active or speaking.");
      return;
    }

    try {
      if (!isSpeakingRef.current && !isRecognitionActiveRef.current) {
        recognitionRef.current?.start();
        isRecognitionActiveRef.current = true; 
      } else {
        console.log("Recognition is already active or speaking.");
        isRecognitionActiveRef.current = false; 
      }
    } catch (error) {
      console.error("Recognition error:", error.message || error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await newRequest.get("/api/v1/users/current");
      if (response) {
        console.log("Current user data:", response.data);
        setUser(response.data);
        dispatch(login({ userData: response.data }));
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognitionActiveRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(handleRecognition, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognitionActiveRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(handleRecognition, 1000);
      }
    };

    recognition.onresult = async (event) => {
      const transcript = event?.results[event.results.length - 1][0]?.transcript
        .replace(".", "")
        .trim();

      console.log("Transcript:", transcript);

      if (
        transcript.toLowerCase().includes(
          selectedUser.userData?.data?.name?.toLowerCase()
        )
      ) {
        recognition.stop();
        isRecognitionActiveRef.current = false;
        setListening(false);
        const responseGamini = await fetchGaminiResponse(transcript);
        handleLink(responseGamini);
      }
    };

    const fallbackInterval = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognitionActiveRef.current) {
        handleRecognition();
      }
    }, 10000);

    // Start initial recognition
    handleRecognition();

    return () => {
      recognition.stop();
      isRecognitionActiveRef.current = false;
      clearInterval(fallbackInterval);
      setListening(false);
    };
  }, [selectedUser]);

  return (
    <div
      className={`w-full h-[100vh] flex flex-col gap-6 justify-center items-center text-shadow-black ${user?.data?.assistantImage ? "bg-cover bg-center" : "bg-black"
        }`}
      style={
        user?.data?.assistantImage
          ? { backgroundImage: `url(${user.data.assistantImage})` }
          : {}
      }
    >
      <h1 className="text-3xl font-bold text-white">Welcome to the Home Page</h1>
      <p className="text-lg text-white">
        {user ? `${user.data.assistantName || "User"}!` : "Loading..."}
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
