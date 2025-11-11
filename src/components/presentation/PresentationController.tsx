'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PresentationDeck } from '@/types/presentation';

/**
 * PresentationController Component
 *
 * Central orchestrator for presentation mode:
 * - Manages deck state and slide navigation
 * - Handles keyboard shortcuts and navigation
 * - Coordinates narration playback timing
 * - Provides slide transition controls
 * - Manages presentation flow state
 *
 * Week 1, Day 2 - Justice League Implementation
 */

export interface PresentationControllerProps {
  /** The deck configuration to present */
  deck: PresentationDeck;

  /** Start at specific slide index (0-based) */
  initialSlideIndex?: number;

  /** Auto-play narration on mount */
  autoPlay?: boolean;

  /** Enable keyboard navigation */
  enableKeyboard?: boolean;

  /** Callback when presentation ends */
  onComplete?: () => void;

  /** Callback when slide changes */
  onSlideChange?: (slideIndex: number) => void;

  /** Child render function */
  children: (state: PresentationState, actions: PresentationActions) => React.ReactNode;
}

/**
 * Presentation state exposed to children
 */
export interface PresentationState {
  /** Current slide index (0-based) */
  currentSlideIndex: number;

  /** Total number of slides */
  totalSlides: number;

  /** Current slide data */
  currentSlide: PresentationDeck['slides'][0];

  /** Is narration playing */
  isPlaying: boolean;

  /** Is narration paused */
  isPaused: boolean;

  /** Current narration segment index */
  currentNarrationIndex: number;

  /** Elapsed time in current slide (ms) */
  elapsedTime: number;

  /** Are captions visible */
  captionsVisible: boolean;

  /** Is presentation in fullscreen */
  isFullscreen: boolean;

  /** Navigation mode: 'manual' | 'auto' | 'timed' */
  navigationMode: 'manual' | 'auto' | 'timed';
}

/**
 * Actions exposed to children
 */
export interface PresentationActions {
  /** Navigate to next slide */
  nextSlide: () => void;

  /** Navigate to previous slide */
  previousSlide: () => void;

  /** Jump to specific slide */
  goToSlide: (index: number) => void;

  /** Start narration playback */
  play: () => void;

  /** Pause narration playback */
  pause: () => void;

  /** Stop and reset narration */
  stop: () => void;

  /** Toggle captions visibility */
  toggleCaptions: () => void;

  /** Toggle fullscreen mode */
  toggleFullscreen: () => void;

  /** Reset presentation to beginning */
  reset: () => void;
}

export const PresentationController: React.FC<PresentationControllerProps> = ({
  deck,
  initialSlideIndex = 0,
  autoPlay = false,
  enableKeyboard = true,
  onComplete,
  onSlideChange,
  children,
}) => {
  // ========================================
  // State Management
  // ========================================

  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isPaused, setIsPaused] = useState(false);
  const [currentNarrationIndex, setCurrentNarrationIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [captionsVisible, setCaptionsVisible] = useState(true); // Default: ON for WCAG 2.1 AA
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [navigationMode] = useState<'manual' | 'auto' | 'timed'>('manual');

  // Refs for timing control
  const narrationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Current slide data
  const currentSlide = deck.slides[currentSlideIndex];
  const totalSlides = deck.slides.length;

  // ========================================
  // Navigation Actions
  // ========================================

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      setCurrentNarrationIndex(0);
      setElapsedTime(0);
      setIsPlaying(false);
      setIsPaused(false);
      onSlideChange?.(nextIndex);

      // Clear any active timers
      if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    } else {
      // Presentation complete
      stop();
      onComplete?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex, totalSlides, onSlideChange, onComplete]);

  const previousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      const prevIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIndex);
      setCurrentNarrationIndex(0);
      setElapsedTime(0);
      setIsPlaying(false);
      setIsPaused(false);
      onSlideChange?.(prevIndex);

      // Clear any active timers
      if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    }
  }, [currentSlideIndex, onSlideChange]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
      setCurrentNarrationIndex(0);
      setElapsedTime(0);
      setIsPlaying(false);
      setIsPaused(false);
      onSlideChange?.(index);

      // Clear any active timers
      if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    }
  }, [totalSlides, onSlideChange]);

  // ========================================
  // Playback Controls
  // ========================================

  const play = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
    startTimeRef.current = Date.now() - elapsedTime;
  }, [elapsedTime]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(true);

    // Clear timers
    if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentNarrationIndex(0);
    setElapsedTime(0);

    // Clear timers
    if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
  }, []);

  const toggleCaptions = useCallback(() => {
    setCaptionsVisible((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentSlideIndex(0);
    setCurrentNarrationIndex(0);
    setElapsedTime(0);
    setIsPlaying(false);
    setIsPaused(false);

    if (narrationTimerRef.current) clearTimeout(narrationTimerRef.current);
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
  }, []);

  // ========================================
  // Narration Timing Effect
  // ========================================

  useEffect(() => {
    if (!isPlaying || !currentSlide.narration.length) return;

    // Update elapsed time every 100ms
    const updateInterval = setInterval(() => {
      const newElapsed = Date.now() - startTimeRef.current;
      setElapsedTime(newElapsed);

      // Check if we should advance to next narration segment
      const currentNarration = currentSlide.narration[currentNarrationIndex];
      if (currentNarration) {
        const segmentEnd = currentNarration.startTime + currentNarration.duration;

        if (newElapsed >= segmentEnd) {
          const nextIndex = currentNarrationIndex + 1;

          if (nextIndex < currentSlide.narration.length) {
            // Move to next narration segment
            setCurrentNarrationIndex(nextIndex);
          } else {
            // Slide narration complete
            if (navigationMode === 'auto') {
              // Auto-advance to next slide
              nextSlide();
            } else {
              // Stop playback at end of slide
              stop();
            }
          }
        }
      }
    }, 100);

    return () => clearInterval(updateInterval);
  }, [isPlaying, currentSlide, currentNarrationIndex, navigationMode, nextSlide, stop]);

  // ========================================
  // Keyboard Navigation
  // ========================================

  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Get shortcuts from deck config or use defaults
      const shortcuts = deck.renderOptions?.shortcuts || {
        next: ['ArrowRight', 'Space'],
        previous: ['ArrowLeft'],
        toggleCaptions: ['c', 'C'],
        play: ['p', 'P'],
        fullscreen: ['f', 'F'],
      };

      // Next slide
      if (shortcuts.next?.includes(e.key)) {
        e.preventDefault();
        nextSlide();
      }

      // Previous slide
      if (shortcuts.previous?.includes(e.key)) {
        e.preventDefault();
        previousSlide();
      }

      // Toggle captions
      if (shortcuts.toggleCaptions?.includes(e.key)) {
        e.preventDefault();
        toggleCaptions();
      }

      // Play/Pause
      if (shortcuts.play?.includes(e.key)) {
        e.preventDefault();
        if (isPlaying) {
          pause();
        } else {
          play();
        }
      }

      // Fullscreen
      if (shortcuts.fullscreen?.includes(e.key)) {
        e.preventDefault();
        toggleFullscreen();
      }

      // Escape to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enableKeyboard,
    deck.renderOptions?.shortcuts,
    nextSlide,
    previousSlide,
    toggleCaptions,
    isPlaying,
    play,
    pause,
    toggleFullscreen,
    isFullscreen,
  ]);

  // ========================================
  // Fullscreen Change Listener
  // ========================================

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // ========================================
  // Cleanup on Unmount
  // ========================================

  useEffect(() => {
    // Cleanup on unmount
    const narrationTimer = narrationTimerRef.current;
    const slideTimer = slideTimerRef.current;

    return () => {
      if (narrationTimer) clearTimeout(narrationTimer);
      if (slideTimer) clearTimeout(slideTimer);
    };
  }, []);

  // ========================================
  // State and Actions Objects
  // ========================================

  const state: PresentationState = {
    currentSlideIndex,
    totalSlides,
    currentSlide,
    isPlaying,
    isPaused,
    currentNarrationIndex,
    elapsedTime,
    captionsVisible,
    isFullscreen,
    navigationMode,
  };

  const actions: PresentationActions = {
    nextSlide,
    previousSlide,
    goToSlide,
    play,
    pause,
    stop,
    toggleCaptions,
    toggleFullscreen,
    reset,
  };

  // ========================================
  // Render
  // ========================================

  return <>{children(state, actions)}</>;
};

export default PresentationController;
