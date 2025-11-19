import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

/**
 * Custom hook for typewriter animation effect
 * Handles typing and deleting text with variable speeds
 */
export const useTypewriter = (options: UseTypewriterOptions) => {
  const {
    texts,
    typingSpeed = 100,
    deletingSpeed = 30,
    pauseDuration = 2000
  } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Check for reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const manual = document.documentElement.classList.contains('reduce-motion');
    return media || manual;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const onToggle = (e: any) => setReducedMotion(!!e?.detail?.enabled);
    window.addEventListener('reduced-motion-changed', onToggle);
    return () => window.removeEventListener('reduced-motion-changed', onToggle);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedText(texts[0]);
      return;
    }

    const currentText = texts[currentIndex];

    const getTypingSpeed = () => {
      if (isDeleting) return deletingSpeed;
      if (isPaused) return pauseDuration;
      
      // Variable typing speed for more natural effect
      const position = displayedText.length;
      if (position < 5) return 150;
      if (position > currentText.length - 5) return 150;
      return typingSpeed + Math.random() * 50;
    };

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText === currentText) {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, pauseDuration);
          return;
        }
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      } else {
        if (displayedText === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          return;
        }
        setDisplayedText(currentText.slice(0, displayedText.length - 1));
      }
    }, getTypingSpeed());

    return () => clearTimeout(timer);
  }, [displayedText, currentIndex, isDeleting, isPaused, reducedMotion, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayedText;
};
