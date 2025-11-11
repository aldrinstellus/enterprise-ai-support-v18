'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { introSlides } from '@/data/introSlides';
import { SlideContent } from './SlideContent';

/**
 * IntroSlides Component
 *
 * Professional intro slides carousel shown on page load before first user message.
 * Features:
 * - 4 slides with CTIS/WTC branding
 * - Auto-advance every 5 seconds (configurable)
 * - Manual navigation controls
 * - Smooth Framer Motion transitions (600ms to match existing animation)
 * - Hides automatically on first user message
 *
 * Phase 3: Presentation Polish
 */

export interface IntroSlidesProps {
  /** Auto-advance interval in milliseconds (default: 5000ms = 5 seconds) */
  autoAdvanceInterval?: number;

  /** Enable auto-advance (default: true) */
  autoAdvance?: boolean;

  /** Callback when slides should be dismissed */
  onDismiss?: () => void;

  /** Show navigation controls (default: true) */
  showControls?: boolean;

  /** Initial slide index (default: 0) */
  initialSlide?: number;
}

export const IntroSlides: React.FC<IntroSlidesProps> = ({
  autoAdvanceInterval = 5000,
  autoAdvance = true,
  onDismiss,
  showControls = true,
  initialSlide = 0,
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isPlaying, setIsPlaying] = useState(autoAdvance);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const totalSlides = introSlides.length;

  /**
   * Navigate to next slide
   */
  const nextSlide = useCallback(() => {
    setDirection('forward');
    setCurrentSlide((prev) => {
      // Loop back to first slide after last
      if (prev === totalSlides - 1) {
        return 0;
      }
      return prev + 1;
    });
  }, [totalSlides]);

  /**
   * Navigate to previous slide
   */
  const previousSlide = useCallback(() => {
    setDirection('backward');
    setCurrentSlide((prev) => {
      // Loop to last slide if at first
      if (prev === 0) {
        return totalSlides - 1;
      }
      return prev - 1;
    });
  }, [totalSlides]);

  /**
   * Toggle play/pause
   */
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  /**
   * Auto-advance timer
   */
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoAdvanceInterval);

    return () => clearInterval(timer);
  }, [isPlaying, nextSlide, autoAdvanceInterval]);

  /**
   * Keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousSlide();
          break;
        case 'Escape':
          e.preventDefault();
          onDismiss?.();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePlayPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, previousSlide, onDismiss, togglePlayPause]);

  const currentSlideData = introSlides[currentSlide];

  /**
   * Slide transition variants (600ms to match InteractiveChat animation)
   */
  const slideVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center max-w-3xl mx-auto relative">
      {/* Slide Container */}
      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <SlideContent slide={currentSlideData} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <div className="flex items-center gap-4 mt-8">
          {/* Previous Button */}
          <button
            onClick={previousSlide}
            className="p-2 rounded-full border border-border bg-card hover:bg-muted transition-colors"
            aria-label="Previous slide"
            title="Previous slide (Arrow Left)"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label={isPlaying ? 'Pause auto-advance' : 'Play auto-advance'}
            title={isPlaying ? 'Pause (P)' : 'Play (P)'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="p-2 rounded-full border border-border bg-card hover:bg-muted transition-colors"
            aria-label="Next slide"
            title="Next slide (Arrow Right or Space)"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Slide Indicators */}
      <div className="flex items-center gap-2 mt-6">
        {introSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 'forward' : 'backward');
              setCurrentSlide(index);
            }}
            className={`h-1.5 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-primary'
                : 'w-1.5 bg-border hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/30">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: autoAdvanceInterval / 1000,
              ease: 'linear',
            }}
            key={currentSlide} // Reset animation on slide change
          />
        </div>
      )}

      {/* Skip Button (bottom-right) */}
      <button
        onClick={onDismiss}
        className="absolute bottom-4 right-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
      >
        Skip intro (Esc)
      </button>

      {/* Keyboard Shortcuts Help (for screen readers) */}
      <div className="sr-only">
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>Arrow Right or Space: Next slide</li>
          <li>Arrow Left: Previous slide</li>
          <li>P: Play/Pause auto-advance</li>
          <li>Escape: Skip intro slides</li>
        </ul>
      </div>
    </div>
  );
};

export default IntroSlides;
