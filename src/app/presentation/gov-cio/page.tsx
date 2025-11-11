'use client';

/**
 * Government CIO Presentation Page
 *
 * Demonstrates the 5-minute executive presentation deck for Government CIOs.
 *
 * Features:
 * - Full presentation mode with narration timing
 * - Keyboard navigation (arrows, space, 'c', 'p', 'f')
 * - Closed captions (WCAG 2.1 AA compliant)
 * - Content highlighting synchronized with narration
 * - Fullscreen support
 *
 * Week 1, Day 2 - Justice League Implementation
 *
 * URL: http://localhost:3016/presentation/gov-cio
 */

import { PresentationDeck } from '@/components/presentation';
import { govCIODeck } from '@/config/decks';

export default function GovCIOPresentationPage() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <PresentationDeck
        deck={govCIODeck}
        initialSlideIndex={0}
        autoPlay={false}
        enableKeyboard={true}
        showControls={true}
        onComplete={() => {
          console.log('Presentation complete!');
        }}
        onSlideChange={(slideIndex) => {
          console.log(`Slide changed to: ${slideIndex + 1}`);
        }}
      />
    </main>
  );
}
