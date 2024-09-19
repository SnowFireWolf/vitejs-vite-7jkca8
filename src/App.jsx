import React, { useState, useEffect, useRef } from 'react';

const MorseCodeApp = () => {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [audioContext, setAudioContext] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutsRef = useRef([]);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    return () => {
      stopPlayback();
    };
  }, []);

  const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.'
  };

  const textToMorse = (input) => {
    return input.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
  };

  const morseToText = (input) => {
    const reverseMorse = Object.entries(morseCode).reduce((acc, [key, value]) => ({...acc, [value]: key}), {});
    return input.split(' ').map(code => reverseMorse[code] || code).join('');
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setMorse(textToMorse(newText));
  };

  const handleMorseChange = (e) => {
    const newMorse = e.target.value;
    setMorse(newMorse);
    setText(morseToText(newMorse));
  };

  const playMorseCode = () => {
    if (!audioContext || isPlaying) return;

    setIsPlaying(true);
    currentIndexRef.current = 0;
    schedule(0);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    currentIndexRef.current = 0;
  };

  const playTone = (startTime, duration) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, startTime);
    oscillator.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const schedule = (index) => {
    if (index >= morse.length) {
      setIsPlaying(false);
      return;
    }

    const dot = 0.1;
    const dash = dot * 3;
    const pause = dot;
    const char = morse[index];
    let duration = 0;

    if (char === '.') {
      playTone(audioContext.currentTime, dot);
      duration = dot + pause;
    } else if (char === '-') {
      playTone(audioContext.currentTime, dash);
      duration = dash + pause;
    } else if (char === ' ') {
      duration = dot * 7;
    }

    currentIndexRef.current = index + 1;
    const timeout = setTimeout(() => schedule(index + 1), duration * 1000);
    timeoutsRef.current.push(timeout);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">摩斯密碼轉換器</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          文字
        </label>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          disabled={isPlaying}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          摩斯密碼
        </label>
        <input
          type="text"
          value={morse}
          onChange={handleMorseChange}
          disabled={isPlaying}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={isPlaying ? stopPlayback : playMorseCode}
          className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            isPlaying
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isPlaying ? '停止' : '播放摩斯密碼'}
        </button>
      </div>
    </div>
  );
};

export default MorseCodeApp;
