'use client';

import { useState } from 'react';

interface ProgressSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function ProgressSlider({ value, onChange }: ProgressSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Ensure value is in 5% increments
  const normalizedValue = Math.round(value / 5) * 5;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    // Round to nearest 5%
    const rounded = Math.round(newValue / 5) * 5;
    onChange(rounded);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const progressColor = getProgressColor(normalizedValue);

  return (
    <div className="space-y-2">
      {/* Percentage Display */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">Completion</span>
        <span className={`text-2xl font-bold ${
          normalizedValue === 100
            ? 'text-green-600'
            : normalizedValue >= 50
            ? 'text-blue-600'
            : 'text-gray-700'
        }`}>
          {normalizedValue}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 relative">
        <div
          className={`h-3 rounded-full transition-all duration-200 ${progressColor} ${
            isDragging ? 'opacity-80' : ''
          }`}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={normalizedValue}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="w-full h-8 appearance-none bg-transparent cursor-pointer slider-thumb"
          style={{
            WebkitAppearance: 'none',
          }}
        />
        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.15s ease;
          }

          input[type='range']::-webkit-slider-thumb:hover {
            background: #2563eb;
            transform: scale(1.1);
          }

          input[type='range']::-webkit-slider-thumb:active {
            background: #1d4ed8;
            transform: scale(0.95);
          }

          input[type='range']::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.15s ease;
          }

          input[type='range']::-moz-range-thumb:hover {
            background: #2563eb;
            transform: scale(1.1);
          }

          input[type='range']::-moz-range-thumb:active {
            background: #1d4ed8;
            transform: scale(0.95);
          }

          input[type='range']::-webkit-slider-runnable-track {
            width: 100%;
            height: 8px;
            cursor: pointer;
            background: transparent;
            border-radius: 4px;
          }

          input[type='range']::-moz-range-track {
            width: 100%;
            height: 8px;
            cursor: pointer;
            background: transparent;
            border-radius: 4px;
          }
        `}</style>
      </div>

      {/* Percentage Markers */}
      <div className="flex justify-between text-xs text-gray-400 px-1">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
