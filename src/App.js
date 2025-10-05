import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [hunger, setHunger] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [action, setAction] = useState("idle");
  const [catImage, setCatImage] = useState("/cat/idle.gif");

  // Audio refs
  const talkAudio = useRef(new Audio("/cat/meow.mp3"));
  const eatAudio = useRef(new Audio("/cat/eat.mp3"));
  const playAudio = useRef(new Audio("/cat/play.mp3"));
  const danceAudio = useRef(new Audio("/cat/dance.mp3"));
  const sleepAudio = useRef(new Audio("/cat/snore.mp3"));

  const talkBtnRef = useRef(null);

  // Auto stat decay
  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((prev) => Math.min(100, prev + 5));
      setEnergy((prev) => Math.max(0, prev - 5));
      setHappiness((prev) => Math.max(0, prev - 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update cat image based on action
  useEffect(() => {
    switch (action) {
      case "eat":
        setCatImage("/cat/eat.gif");
        break;
      case "play":
        setCatImage("/cat/play.gif");
        break;
      case "sleep":
        setCatImage("/cat/sleep.gif");
        break;
      case "dance":
        setCatImage("/cat/dance.gif");
        break;
      case "talk":
        setCatImage("/cat/talk.gif");
        break;
      default:
        setCatImage("/cat/idle.gif");
    }
  }, [action]);

  // Stop all audios
  const stopAllAudio = () => {
    [talkAudio, eatAudio, playAudio, danceAudio, sleepAudio].forEach((audioRef) => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    });
  };

  // Stop current action
  const stopAction = () => {
    stopAllAudio();
    setAction("idle");
  };

  // Click outside to stop any action
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !talkBtnRef.current.contains(e.target) &&
        !e.target.closest(".actions button")
      ) {
        stopAction();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Action handlers
  const feed = () => {
    stopAction();
    setHunger((prev) => Math.max(0, prev - 20));
    setAction("eat");
    eatAudio.current.play();
  };

  const playAction = () => {
    stopAction();
    setHappiness((prev) => Math.min(100, prev + 20));
    setEnergy((prev) => Math.max(0, prev - 10));
    setAction("play");
    playAudio.current.play();
  };

  const rest = () => {
    stopAction();
    setEnergy((prev) => Math.min(100, prev + 30));
    setAction("sleep");
    sleepAudio.current.play();
  };

  const dance = () => {
    stopAction();
    setHappiness((prev) => Math.min(100, prev + 25));
    setEnergy((prev) => Math.max(0, prev - 15));
    setAction("dance");
    danceAudio.current.play();
  };

  const startTalk = () => {
    stopAction();
    setAction("talk");
    talkAudio.current.play();
  };

  return (
    <div className="game">
      <h1>🐾 Talking Cat Game</h1>

      {/* Animated Cat */}
      <motion.img
        key={catImage}
        src={catImage}
        alt="cat"
        className="cat"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Stats */}
      <div className="stats">
        <p>🍖 Hunger: {hunger}</p>
        <p>🎉 Happiness: {happiness}</p>
        <p>⚡ Energy: {energy}</p>
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={feed}>🍖 Feed</button>
        <button onClick={playAction}>🎮 Play</button>
        <button onClick={rest}>🛏️ Sleep</button>
        <button onClick={dance}>💃 Dance</button>
        <button ref={talkBtnRef} onClick={startTalk}>
          🎤 Talk
        </button>
      </div>
    </div>
  );
}

export default App;
