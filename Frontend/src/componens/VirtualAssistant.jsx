import React, { useState, useRef, useEffect } from 'react';
import { RobotFace } from './RobotFace';
// import { Button } from "../ui/Button"
// import { Textarea } from './ui/Textarea';
// import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Mic, MicOff, Volume2, VolumeX, Send, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export const VirtualAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text, type) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date()
    }]);
  };

  const speakText = async (text) => {
    if (isMuted) return;

    // Placeholder for speech logic
    setIsSpeaking(true);
    setEmotion('happy');

    // Simulate speech duration
    setTimeout(() => {
      setIsSpeaking(false);
      setEmotion('neutral');
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, 'user');
    setEmotion('thinking');

    setTimeout(() => {
      const responses = [
        "I understand what you're saying. How can I help you further?",
        "That's an interesting point. Let me think about that for a moment.",
        "I'm here to assist you with whatever you need.",
        "Thank you for sharing that with me. What would you like to know?",
        "I'm processing your request. Is there anything specific you'd like me to focus on?"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'assistant');
      setEmotion('neutral');
      speakText(randomResponse);
    }, 1500);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setIsSpeaking(false);
    setEmotion('neutral');
  };

  const startListening = () => {
    setIsListening(true);
    toast.info('Voice recognition coming soon!');
    setTimeout(() => setIsListening(false), 3000);
  };

  return (
    <div className=" text-foreground overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-ai bg-clip-text text-transparent mb-2">
            Virtual Assistant
          </h1>
          <p className="text-muted-foreground">Your AI companion with a friendly face</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="animate-float">
            <RobotFace 
              isSpeaking={isSpeaking} 
              isListening={isListening}
              emotion={emotion}
            />
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <Badge variant={isListening ? "default" : "secondary"}>{isListening ? "Listening..." : "Ready"}</Badge>
          <Badge variant={isSpeaking ? "default" : "secondary"}>{isSpeaking ? "Speaking..." : "Silent"}</Badge>
        </div>
      </div>
    </div>
  );
};
