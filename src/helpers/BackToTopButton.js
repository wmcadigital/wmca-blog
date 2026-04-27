import { useState, useEffect } from 'react';

/**
 * BackToTopButton — A sticky button that appears when user scrolls down
 * Smoothly scrolls page back to the top when clicked
 */
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down past 300px
  const toggleVisibility = () => {
    if (typeof window !== 'undefined') {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsVisible(scrollY > 300);
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="wmca-back-to-top-btn"
      aria-label="Scroll to top of page"
      title="Back to top"
    >
      <span className="wmca-back-to-top-icon">↑</span>
    </button>
  );
};

export default BackToTopButton;
