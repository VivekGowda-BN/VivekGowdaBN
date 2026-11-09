import React from 'react';
import './CircularText.css';

/**
 * CircularText (React Bits Component)
 * Compact, elegant display badge with smooth continuous rotation
 * Positioned in the open space between the stool legs
 */
export default function CircularText({
  text = 'SCROLL • TO • EXPLORE • ',
  spinDuration = 20,
  radius = 24,
  fontSize = '6px',
  centerContent = null,
  className = '',
}) {
  const letters = Array.from(text);

  return (
    <div
      className={`circular-text-wrap ${className}`}
      aria-hidden="true"
      style={{
        width: `${radius * 2 + 12}px`,
        height: `${radius * 2 + 12}px`,
        '--spin-duration': `${spinDuration}s`,
        '--radius': `${radius}px`,
        '--font-size': fontSize,
      }}
    >
      <div className="circular-text-ring">
        {letters.map((char, i) => {
          const rotationAngle = (360 / letters.length) * i;
          return (
            <span
              key={i}
              className="circular-text-char"
              style={{
                transform: `rotate(${rotationAngle}deg) translateY(-${radius}px)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {centerContent && (
        <div className="circular-text-center">
          {centerContent}
        </div>
      )}
    </div>
  );
}
