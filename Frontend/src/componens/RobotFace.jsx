import React from 'react';
import { cn } from '../lib/utils';

export const RobotFace = ({
  isSpeaking = false,
  isListening = false,
  emotion = 'neutral',
  text
}) => {
  return (
    <div className="relative mx-auto h-80 w-80">
      {/* Outer Glow Ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-ai blur-xl transition-all duration-500",
          isListening ? "opacity-40 scale-110" : "opacity-20",
          isSpeaking && "animate-pulse-glow"
        )}
      />

      {/* Face */}
      <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-blue-500/50 bg-gradient-face shadow-face">
        {/* Inner Glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-glow opacity-60" />

        {/* Face Content */}
        <div className="relative h-full w-full p-8">
          {/* Eyes */}
          <div className="mt-16 mb-8 flex items-center justify-between px-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="relative h-8 w-12">
                {/* Eye background with blink animation */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-full bg-face-shadow bg-white shadow-inner",
                    "animate-blink"
                  )}
                >

                {/* Iris */}
                <div
                  className={cn(
                    "absolute top-1 left-2 h-6 w-8 rounded-full shadow-glow transition-all duration-300 z-10",
                    "bg-ai-blue animate-eye-move",
                    emotion === 'happy' && "scale-110",
                    emotion === 'thinking' && "translate-x-1",
                    isListening && "bg-ai-cyan scale-125"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 left-2 h-4 w-4 rounded-full shadow-sm",
                      i === 0 ? "bg-black" : "bg-robot-glow"
                    )}
                  />
                </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nose/Sensor */}
          <div className="mb-6 flex justify-center">
            <div className="h-3 w-2 rounded-sm bg-primary/50" />
          </div>

          {/* Mouth */}
          <div className="flex justify-center">
            <div
              className={cn(
                "relative rounded-full bg-face-shadow shadow-inner transition-all duration-200",
                "h-8 w-16",
                emotion === 'happy' && "w-20 h-6",
                emotion === 'thinking' && "w-12 h-10"
              )}
            >
              <div
                className={cn(
                  "absolute inset-1 rounded-full bg-primary shadow-ai transition-all duration-100",
                  isSpeaking && "animate-talk bg-ai-cyan",
                  emotion === 'happy' && "bg-ai-electric"
                )}
              />
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full bg-ai-blue/30 animate-pulse" />
              )}
            </div>
          </div>

          {/* Audio Bars */}
          {isSpeaking && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-1 rounded-full bg-ai-blue shadow-glow animate-bounce"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Listening Ring */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-4 border-ai-cyan/50 animate-ping" />
        )}
      </div>

      {/* Status Indicator */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 transform">
        <div
          className={cn(
            "h-3 w-3 rounded-full border-2 border-card transition-all duration-300",
            isListening && "bg-ai-cyan shadow-glow",
            isSpeaking && "bg-ai-blue shadow-glow animate-pulse",
            !isListening && !isSpeaking && "bg-muted"
          )}
        />
      </div>
    </div>
  );
};
