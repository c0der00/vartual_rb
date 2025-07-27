import { Outlet } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Mark session as active
    sessionStorage.setItem("session-active", "true");

    // Clear localStorage when tab/browser closes
    const handleBeforeUnload = () => {
      if (sessionStorage.getItem("session-active")) {
        localStorage.removeItem("authState");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <>
    <Outlet/>
    </>
  )
}

export default App
