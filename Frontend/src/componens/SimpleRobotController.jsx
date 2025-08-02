import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { login, logout } from "../redux/authSlice";
import { RobotFace } from "../componens/RobotFace";
import { speakWithPhonemes } from "../utils/speakWithPhonemes";

const phonemeToViseme = {
  AH: 'open', OW: 'round', M: 'closed', P: 'closed',
  S: 'teeth', F: 'teeth', L: 'tongue', W: 'round',
  SH: 'teeth', T: 'neutral', Z: 'teeth'
};

export function SimpleRobotController() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedUser = useSelector(state => state.auth);
  const [user, setUser] = useState(null);
  const [listing, setListening] = useState(false);
  const isListeningRef = useRef(false);
  const [viseme, setViseme] = useState('neutral');

  useEffect(() => {
    newRequest.get("/api/v1/users/current").then(response => {
      setUser(response.data);
      dispatch(login({ userData: response.data }));
    });
  }, [dispatch]);

  const fetchGaminiResponse = async prompt => {
    const res = await newRequest.post("/api/v1/gamini", {
      prompt,
      assistentName: selectedUser.userData?.data?.assistentName,
      name: selectedUser.userData?.data?.name
    });
    return res.data;
  };

  const handleResponse = async gamini => {
    const { type, userinput, response } = gamini;
    // speak via Speak.js with phonemes timeline
    const phonemeData = await speakWithPhonemes(response, audioUrl => {
      const audio = new Audio(audioUrl);
      audio.play();
    });

    isListeningRef.current = true;
    setListening(false);

    // Animate visemes
    phonemeData.forEach(evt => {
      setTimeout(() => {
        setViseme(phonemeToViseme[evt.phoneme] || 'neutral');
      }, evt.start * 1000);
    });

    // Reset viseme after last event
    const last = phonemeData[phonemeData.length - 1];
    setTimeout(() => {
      setViseme('neutral');
      isListeningRef.current = false;
      startRecognition();
    }, (last.start + last.duration) * 1000);

    // optionally open links
    switch(type) {
      case 'google_search':
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userinput)}`, '_blank');
        break;
      case 'instagram_open':
        window.open('https://www.instagram.com/', '_blank');
        break;
      // add others...
      case 'logout':
        handleLogout();
        break;
      default:
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    await newRequest.post("/api/v1/users/logout", {}, { withCredentials: true });
    navigate("/signin");
    setUser(null);
  };

  const startRecognition = () => {
    if (!isListeningRef.current && recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const recognitionRef = useRef(null);
  const recognitionState = useRef({ speaking: false });

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      recognitionState.current.speaking = true;
      setListening(true);
    };
    recognition.onend = () => {
      recognitionState.current.speaking = false;
      setListening(false);
      setTimeout(() => startRecognition(), 1000);
    };
    recognition.onerror = e => {
      recognitionState.current.speaking = false;
      setListening(false);
      setTimeout(() => startRecognition(), 1000);
    };
    recognition.onresult = async event => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      if (transcript.toLowerCase().includes(selectedUser.userData?.data?.assistentName.toLowerCase())) {
        recognition.stop();
        recognitionState.current.speaking = false;
        setListening(false);
        const gamini = await fetchGaminiResponse(transcript);
        gamini.response = "hello world";
        handleResponse(gamini);
      }
    };
    // initial start
    startRecognition();
    const fallback = setInterval(() => {
      if (!isListeningRef.current && !recognitionState.current.speaking) {
        startRecognition();
      }
    }, 10000);

    return () => {
      recognition.stop();
      clearInterval(fallback);
    };
  }, [selectedUser.userData]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black bg-cover bg-center text-white">
      <h1 className="text-3xl font-bold text-white">Welcome {user?.data?.assistantName || "User"}!</h1>
      <RobotFace isSpeaking={isListeningRef.current} isListening={listing} viseme={viseme} />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

 