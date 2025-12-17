import { useState, useEffect } from 'react';

function StreamingText({ text, delay = 30, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return <span>{displayedText}</span>;
}

export default StreamingText;
