"use client";

import React, { useState } from "react";

export const SpinningWheel = ({ className = "", onSpin }: { className?: string, onSpin?: () => void }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    if (onSpin) onSpin();

    // Spin a random number of full rotations (3-6) plus a random angle
    const newRotation = rotation + (360 * Math.floor(Math.random() * 4 + 3)) + Math.floor(Math.random() * 360);
    setRotation(newRotation);
    
    // Stop spinning after transition ends (e.g. 3 seconds)
    setTimeout(() => {
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className={`relative ${className}`}>
      <svg 
        preserveAspectRatio="none" 
        width="100%" 
        height="100%" 
        overflow="visible" 
        viewBox="0 0 946 945" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_116_544)">
          <g 
            style={{ 
              transform: `rotate(${rotation}deg)`, 
              transformOrigin: 'center',
              transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
          >
            <path className="hover:opacity-80 hover:fill-[#286bff] transition-colors cursor-pointer" d="M946 472.5H473L807.463 138.39L809.466 140.399C893.883 225.745 946 343.047 946 472.5Z" fill="#4D4D4D"/>
            <path className="hover:opacity-80 hover:fill-[#286bff] transition-colors cursor-pointer" d="M946 472.5C946 602.979 893.059 721.104 807.463 806.609L473 472.5H946Z" fill="#808080"/>
            <path className="hover:opacity-80 hover:fill-[#286bff] transition-colors cursor-pointer" d="M807.463 806.609C721.867 892.115 603.617 945 473 945V472.5L807.463 806.609Z" fill="#B3B3B3"/>
            <path className="hover:opacity-80 hover:fill-[#286bff] transition-colors cursor-pointer" d="M473 472.5V945C342.383 945 224.133 892.115 138.537 806.609L473 472.5Z" fill="#1A1A1A"/>
            <path className="hover:opacity-80 hover:fill-[#286bff] transition-colors cursor-pointer" d="M473 472.5H0C0 343.047 52.1168 225.745 136.534 140.399L138.537 138.39L473 472.5Z" fill="#808080"/>
            <path className="hover:opacity-80 hover:fill-[#286bff] transition-colors cursor-pointer" d="M473 472.5L138.537 806.609C52.9413 721.104 0 602.979 0 472.5H473Z" fill="#4D4D4D"/>
            <path className="hover:opacity-80 hover:fill-[#286bff] transition-colors cursor-pointer" d="M473 0V472.5L138.537 138.39L140.548 136.389C225.984 52.0617 343.41 0 473 0Z" fill="#B3B3B3"/>
            <path className="hover:opacity-80 hover:fill-[#286bff] transition-colors cursor-pointer" d="M807.463 138.39L473 472.5V0C602.59 0 720.016 52.0617 805.453 136.389L807.463 138.39Z" fill="#1A1A1A"/>
          </g>
          {/* Center Button */}
          <path 
            onClick={handleSpin}
            className="cursor-pointer hover:fill-[#e0e0e0] transition-colors"
            d="M473.228 639.102C565.585 639.102 640.456 564.311 640.456 472.051C640.456 379.791 565.585 305 473.228 305C380.87 305 306 379.791 306 472.051C306 564.311 380.87 639.102 473.228 639.102Z" 
            fill="#F2F2F2"
          />
        </g>
        <defs>
          <clipPath id="clip0_116_544">
            <rect width="946" height="945" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};
