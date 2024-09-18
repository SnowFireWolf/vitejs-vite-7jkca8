import React, { useState, useEffect } from 'react';

const MorseCodeApp = () => {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
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
    if (!audioContext) return;

    const dot = 0.1;
    const dash = dot * 3;
    const pause = dot;
    let startTime = audioContext.currentTime;

    morse.split('').forEach(char => {
      if (char === '.') {
        playTone(startTime, dot);
        startTime += dot + pause;
      } else if (char === '-') {
        playTone(startTime, dash);
        startTime += dash + pause;
      } else if (char === ' ') {
        startTime += dot * 7;
      }
    });
  };

  const playTone = (startTime, duration) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, startTime);
    oscillator.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={playMorseCode}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        播放摩斯密碼
      </button>
    </div>
  );
};

export default MorseCodeApp;