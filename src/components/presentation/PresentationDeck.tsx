'use client';

import React from 'react';
import { PresentationController } from './PresentationController';
import { SlideRenderer } from './SlideRenderer';
import { PresentationDeck as DeckType } from '@/types/presentation';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize, Minimize } from 'lucide-react';

/**
 * PresentationDeck Component
 *
 * Full presentation deck wrapper that combines:
 * - PresentationController for state/navigation
 * - SlideRenderer for visual rendering
 * - Navigation controls (previous, next, play/pause, fullscreen)
 * - Progress indicator
 *
 * Week 1, Day 2 - Justice League Implementation
 */

export interface PresentationDeckProps {
  /** The deck configuration to present */
  deck: DeckType;

  /** Start at specific slide index (0-based) */
  initialSlideIndex?: number;

  /** Auto-play narration on mount */
  autoPlay?: boolean;

  /** Enable keyboard navigation */
  enableKeyboard?: boolean;

  /** Show navigation controls */
  showControls?: boolean;

  /** Callback when presentation ends */
  onComplete?: () => void;

  /** Callback when slide changes */
  onSlideChange?: (slideIndex: number) => void;
}

export const PresentationDeck: React.FC<PresentationDeckProps> = ({
  deck,
  initialSlideIndex = 0,
  autoPlay = false,
  enableKeyboard = true,
  showControls = true,
  onComplete,
  onSlideChange,
}) => {
  return (
    <PresentationController
      deck={deck}
      initialSlideIndex={initialSlideIndex}
      autoPlay={autoPlay}
      enableKeyboard={enableKeyboard}
      onComplete={onComplete}
      onSlideChange={onSlideChange}
    >
      {(state, actions) => {
        // Get current narration text for captions
        const currentNarration = state.currentSlide.narration[state.currentNarrationIndex];
        const narrationText = currentNarration?.text || '';

        // Get highlighted content blocks
        const highlightedBlocks = currentNarration?.highlightBlocks || [];

        return (
          <div className="relative w-full h-screen bg-black">
            {/* Slide Renderer */}
            <SlideRenderer
              slide={state.currentSlide}
              theme={deck.theme}
              highlightedBlocks={highlightedBlocks}
              narrationText={narrationText}
              showCaptions={state.captionsVisible}
              direction={state.currentSlideIndex > (initialSlideIndex || 0) ? 'forward' : 'backward'}
              showSlideNumber={deck.renderOptions?.showSlideNumbers !== false}
              slideNumber={state.currentSlideIndex + 1}
              totalSlides={state.totalSlides}
            />

            {/* Navigation Controls */}
            {showControls && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/80 px-6 py-3 rounded-full">
                {/* Previous Slide Button */}
                <button
                  onClick={actions.previousSlide}
                  disabled={state.currentSlideIndex === 0}
                  className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous slide"
                  title="Previous slide (Arrow Left)"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={state.isPlaying ? actions.pause : actions.play}
                  className="p-3 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors"
                  aria-label={state.isPlaying ? 'Pause narration' : 'Play narration'}
                  title={state.isPlaying ? 'Pause narration (P)' : 'Play narration (P)'}
                >
                  {state.isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>

                {/* Next Slide Button */}
                <button
                  onClick={actions.nextSlide}
                  disabled={state.currentSlideIndex === state.totalSlides - 1}
                  className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next slide"
                  title="Next slide (Arrow Right or Space)"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Slide Progress Indicator */}
                <div className="mx-4 text-sm text-gray-300">
                  {state.currentSlideIndex + 1} / {state.totalSlides}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={actions.toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label={state.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  title={state.isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
                >
                  {state.isFullscreen ? (
                    <Minimize className="w-5 h-5 text-white" />
                  ) : (
                    <Maximize className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Caption Toggle Button */}
                <button
                  onClick={actions.toggleCaptions}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    state.captionsVisible
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                  aria-label={state.captionsVisible ? 'Hide captions' : 'Show captions'}
                  title={state.captionsVisible ? 'Hide captions (C)' : 'Show captions (C)'}
                >
                  CC
                </button>
              </div>
            )}

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
              <div
                className="h-full bg-orange-600 transition-all duration-300"
                style={{
                  width: `${((state.currentSlideIndex + 1) / state.totalSlides) * 100}%`,
                }}
                role="progressbar"
                aria-valuenow={state.currentSlideIndex + 1}
                aria-valuemin={1}
                aria-valuemax={state.totalSlides}
                aria-label="Presentation progress"
              />
            </div>

            {/* Keyboard Shortcuts Help (Hidden, for screen readers) */}
            <div className="sr-only">
              <h2>Keyboard Shortcuts</h2>
              <ul>
                <li>Arrow Right or Space: Next slide</li>
                <li>Arrow Left: Previous slide</li>
                <li>P: Play/Pause narration</li>
                <li>C: Toggle captions</li>
                <li>F: Toggle fullscreen</li>
                <li>Escape: Exit fullscreen</li>
              </ul>
            </div>
          </div>
        );
      }}
    </PresentationController>
  );
};

export default PresentationDeck;
