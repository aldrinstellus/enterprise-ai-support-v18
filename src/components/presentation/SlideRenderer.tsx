'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PresentationSlide, ContentBlock } from '@/types/presentation/slide';
import { DeckTheme } from '@/types/presentation/deck';

/**
 * SlideRenderer Component
 *
 * Renders a single presentation slide with:
 * - Framer Motion animations for transitions
 * - Content block highlighting during narration
 * - Responsive layout with theme support
 * - Accessibility features (ARIA attributes)
 *
 * Week 1, Day 2 - Justice League Implementation
 */

export interface SlideRendererProps {
  /** The slide to render */
  slide: PresentationSlide;

  /** Optional theme configuration */
  theme?: DeckTheme;

  /** Content blocks to highlight (by ID) */
  highlightedBlocks?: string[];

  /** Current narration text for closed captions */
  narrationText?: string;

  /** Show captions */
  showCaptions?: boolean;

  /** Slide transition direction */
  direction?: 'forward' | 'backward';

  /** Show slide number */
  showSlideNumber?: boolean;

  /** Current slide number (1-based) */
  slideNumber?: number;

  /** Total number of slides */
  totalSlides?: number;
}

/**
 * Animation variants for slide transitions
 */
const slideVariants = {
  enter: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? -1000 : 1000,
    opacity: 0,
  }),
};

/**
 * Animation variants for content blocks
 */
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  }),
  highlighted: {
    scale: 1.02,
    backgroundColor: 'rgba(255, 165, 0, 0.1)', // Subtle orange highlight
    transition: { duration: 0.3 },
  },
} as const;

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  theme,
  highlightedBlocks = [],
  narrationText = '',
  showCaptions = true,
  direction = 'forward',
  showSlideNumber = true,
  slideNumber = 1,
  totalSlides = 1,
}) => {
  /**
   * Render a single content block
   */
  const renderContentBlock = (block: ContentBlock, index: number) => {
    const isHighlighted = highlightedBlocks.includes(block.id);

    switch (block.type) {
      case 'heading':
        return (
          <motion.h2
            key={block.id}
            id={block.id}
            custom={index}
            initial="hidden"
            animate={isHighlighted ? 'highlighted' : 'visible'}
            variants={contentVariants}
            className="text-4xl font-bold mb-6"
            style={{ color: theme?.primaryColor || '#FF8800' }}
          >
            {block.content}
          </motion.h2>
        );

      case 'subheading':
        return (
          <motion.h3
            key={block.id}
            id={block.id}
            custom={index}
            initial="hidden"
            animate={isHighlighted ? 'highlighted' : 'visible'}
            variants={contentVariants}
            className="text-2xl font-semibold mb-4"
            style={{ color: theme?.secondaryColor || '#FFA500' }}
          >
            {block.content}
          </motion.h3>
        );

      case 'text':
        return (
          <motion.p
            key={block.id}
            id={block.id}
            custom={index}
            initial="hidden"
            animate={isHighlighted ? 'highlighted' : 'visible'}
            variants={contentVariants}
            className="text-lg mb-4 leading-relaxed"
          >
            {block.content}
          </motion.p>
        );

      case 'bullet':
        return (
          <motion.li
            key={block.id}
            id={block.id}
            custom={index}
            initial="hidden"
            animate={isHighlighted ? 'highlighted' : 'visible'}
            variants={contentVariants}
            className="text-lg mb-3 ml-6 leading-relaxed"
          >
            {block.content}
          </motion.li>
        );

      case 'code':
        return (
          <motion.pre
            key={block.id}
            id={block.id}
            custom={index}
            initial="hidden"
            animate={isHighlighted ? 'highlighted' : 'visible'}
            variants={contentVariants}
            className="bg-gray-900 p-4 rounded-lg mb-4 overflow-x-auto"
          >
            <code className="text-sm font-mono text-green-400">
              {block.content}
            </code>
          </motion.pre>
        );

      case 'image':
        return (
          <motion.div
            key={block.id}
            id={block.id}
            custom={index}
            initial="hidden"
            animate={isHighlighted ? 'highlighted' : 'visible'}
            variants={contentVariants}
            className="mb-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.content}
              alt={block.alt || 'Slide image'}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
            {block.alt && (
              <p className="text-sm text-gray-400 mt-2 text-center">
                {block.alt}
              </p>
            )}
          </motion.div>
        );

      case 'callout':
        return (
          <motion.div
            key={block.id}
            id={block.id}
            custom={index}
            initial="hidden"
            animate={isHighlighted ? 'highlighted' : 'visible'}
            variants={contentVariants}
            className="bg-orange-900/20 border-l-4 border-orange-500 p-4 mb-4 rounded-r-lg"
          >
            <p className="text-lg font-semibold text-orange-300">
              {block.content}
            </p>
          </motion.div>
        );

      case 'chart':
        // Chart rendering will be implemented in future iterations
        return (
          <motion.div
            key={block.id}
            id={block.id}
            custom={index}
            initial="hidden"
            animate={isHighlighted ? 'highlighted' : 'visible'}
            variants={contentVariants}
            className="bg-gray-800 p-6 rounded-lg mb-4 text-center"
          >
            <p className="text-gray-400">
              [Chart: {block.content}]
            </p>
          </motion.div>
        );

      case 'video':
        // Video rendering will be implemented in future iterations
        return (
          <motion.div
            key={block.id}
            id={block.id}
            custom={index}
            initial="hidden"
            animate={isHighlighted ? 'highlighted' : 'visible'}
            variants={contentVariants}
            className="bg-gray-800 p-6 rounded-lg mb-4 text-center"
          >
            <p className="text-gray-400">
              [Video: {block.content}]
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  /**
   * Group bullet points into <ul> lists
   */
  const renderContent = () => {
    const elements: React.ReactNode[] = [];
    let bulletGroup: ContentBlock[] = [];
    let bulletGroupIndex = 0;

    slide.content.forEach((block, index) => {
      if (block.type === 'bullet') {
        bulletGroup.push(block);
      } else {
        // Render previous bullet group if exists
        if (bulletGroup.length > 0) {
          elements.push(
            <motion.ul
              key={`bullet-group-${bulletGroupIndex}`}
              className="mb-6"
              initial="hidden"
              animate="visible"
            >
              {bulletGroup.map((bulletBlock, i) =>
                renderContentBlock(bulletBlock, i)
              )}
            </motion.ul>
          );
          bulletGroup = [];
          bulletGroupIndex++;
        }

        // Render non-bullet block
        elements.push(renderContentBlock(block, index));
      }
    });

    // Render remaining bullet group
    if (bulletGroup.length > 0) {
      elements.push(
        <motion.ul
          key={`bullet-group-${bulletGroupIndex}`}
          className="mb-6"
          initial="hidden"
          animate="visible"
        >
          {bulletGroup.map((bulletBlock, i) =>
            renderContentBlock(bulletBlock, i)
          )}
        </motion.ul>
      );
    }

    return elements;
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={slide.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className="w-full h-screen flex flex-col justify-center items-center px-16 py-12 relative"
        style={{
          backgroundColor: theme?.backgroundColor || 'hsl(20 14% 8%)',
          color: theme?.textColor || '#FFFFFF',
        }}
        role="article"
        aria-label={`Slide ${slideNumber}: ${slide.title}`}
      >
        {/* Slide Title */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl font-bold mb-12 text-center"
          style={{ color: theme?.primaryColor || '#FF8800' }}
        >
          {slide.title}
        </motion.h1>

        {/* Slide Content */}
        <div className="max-w-5xl w-full">
          {renderContent()}
        </div>

        {/* Closed Captions */}
        {showCaptions && narrationText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 left-0 right-0 mx-auto max-w-4xl bg-black/80 px-8 py-4 rounded-lg text-center"
            role="region"
            aria-live="polite"
            aria-label="Closed captions"
          >
            <p className="text-lg leading-relaxed text-white">
              {narrationText}
            </p>
          </motion.div>
        )}

        {/* Slide Number */}
        {showSlideNumber && (
          <div
            className="absolute bottom-8 right-8 text-sm text-gray-400"
            aria-label={`Slide ${slideNumber} of ${totalSlides}`}
          >
            {slideNumber} / {totalSlides}
          </div>
        )}

        {/* ARIA Live Region for Screen Readers */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Slide {slideNumber} of {totalSlides}: {slide.title}
          {narrationText && `. ${narrationText}`}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideRenderer;
