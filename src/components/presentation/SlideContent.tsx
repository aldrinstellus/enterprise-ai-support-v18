'use client';

import React from 'react';
import { PresentationSlide, ContentBlock } from '@/types/presentation';
import { CTISLogo } from '@/components/layout/CTISLogo';
import { Sparkles, CheckCircle2, TrendingUp, Users, Headphones, Target } from 'lucide-react';

/**
 * SlideContent Component
 *
 * Renders individual slide content based on slide type.
 * Supports:
 * - Title slides with CTIS branding
 * - Overview slides with bullet points
 * - Metric slides with callouts
 * - Content slides with features
 *
 * Phase 3: Presentation Polish
 */

export interface SlideContentProps {
  /** Slide data to render */
  slide: PresentationSlide;

  /** Content blocks to highlight (for narration sync) */
  highlightedBlocks?: string[];

  /** Show closed captions */
  showCaptions?: boolean;

  /** Caption text to display */
  captionText?: string;
}

export const SlideContent: React.FC<SlideContentProps> = ({
  slide,
  highlightedBlocks = [],
  showCaptions = false,
  captionText,
}) => {
  /**
   * Check if a block is highlighted
   */
  const isHighlighted = (blockId: string): boolean => {
    return highlightedBlocks.includes(blockId);
  };

  /**
   * Render content block based on type
   */
  const renderContentBlock = (block: ContentBlock) => {
    const highlighted = isHighlighted(block.id);

    switch (block.type) {
      case 'heading':
        return (
          <h1
            key={block.id}
            className={`text-4xl md:text-5xl font-bold text-foreground mb-3 transition-all ${
              highlighted ? 'text-primary scale-105' : ''
            }`}
          >
            {block.content}
          </h1>
        );

      case 'subheading':
        return (
          <p
            key={block.id}
            className={`text-muted-foreground text-lg mb-8 max-w-md mx-auto transition-all ${
              highlighted ? 'text-foreground scale-105' : ''
            }`}
          >
            {block.content}
          </p>
        );

      case 'bullet':
        return (
          <li
            key={block.id}
            className={`flex items-start gap-3 text-left transition-all ${
              highlighted ? 'text-primary font-medium scale-105' : 'text-foreground'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span>{block.content}</span>
          </li>
        );

      case 'callout':
        const isPrimary = block.variant === 'primary';
        return (
          <div
            key={block.id}
            className={`p-4 rounded-lg border transition-all ${
              highlighted
                ? 'border-primary bg-primary/10 scale-105'
                : isPrimary
                ? 'border-primary/30 bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            <p className={`text-lg font-semibold ${highlighted ? 'text-primary' : 'text-foreground'}`}>
              {block.content}
            </p>
          </div>
        );

      case 'text':
        return (
          <p
            key={block.id}
            className={`text-foreground transition-all ${
              highlighted ? 'text-primary font-medium scale-105' : ''
            }`}
          >
            {block.content}
          </p>
        );

      default:
        return (
          <div key={block.id} className="text-foreground">
            {block.content}
          </div>
        );
    }
  };

  /**
   * Render slide based on type
   */
  const renderSlide = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center space-y-6">
            {/* CTIS Logo */}
            <div className="mb-4 scale-110">
              <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <span className="text-lg font-bold text-primary">CT</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground tracking-wide">CTIS</span>
                  <span className="text-[10px] text-muted-foreground">Customer Technology</span>
                </div>
              </div>
            </div>

            {/* WTC Title */}
            <div className="text-center mb-4">
              <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">WTC</span>
            </div>

            {/* Slide Content */}
            {slide.content.map(renderContentBlock)}

            {/* Sparkles Icon */}
            <div className="mt-6 w-12 h-12 rounded-full bg-gradient-to-br from-primary via-chart-3 to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="flex flex-col items-center space-y-6">
            {/* Heading */}
            {slide.content
              .filter((block) => block.type === 'heading')
              .map(renderContentBlock)}

            {/* Persona Icons */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/30">
                <Users className="w-5 h-5 text-teal-500" />
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30">
                <Headphones className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                <Target className="w-5 h-5 text-cyan-500" />
              </div>
            </div>

            {/* Bullets */}
            <ul className="space-y-3 max-w-2xl">
              {slide.content
                .filter((block) => block.type === 'bullet')
                .map(renderContentBlock)}
            </ul>
          </div>
        );

      case 'metric':
        return (
          <div className="flex flex-col items-center space-y-6">
            {/* Heading */}
            {slide.content
              .filter((block) => block.type === 'heading')
              .map(renderContentBlock)}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-6">
              {slide.content
                .filter((block) => block.type === 'callout')
                .map(renderContentBlock)}
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="flex flex-col items-center space-y-6">
            {/* Heading */}
            {slide.content
              .filter((block) => block.type === 'heading')
              .map(renderContentBlock)}

            {/* Subheading (if any) */}
            {slide.subtitle && (
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                {slide.subtitle}
              </p>
            )}

            {/* Bullets */}
            <ul className="space-y-3 max-w-2xl text-base">
              {slide.content
                .filter((block) => block.type === 'bullet')
                .map(renderContentBlock)}
            </ul>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{slide.title}</h1>
            {slide.subtitle && (
              <p className="text-muted-foreground text-lg">{slide.subtitle}</p>
            )}
            <div className="space-y-3 max-w-2xl">
              {slide.content.map(renderContentBlock)}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full py-8 px-6">
      {renderSlide()}

      {/* Closed Captions (if enabled) */}
      {showCaptions && captionText && (
        <div className="mt-8 p-4 bg-black/80 text-white text-center rounded-lg max-w-2xl mx-auto">
          <p className="text-sm">{captionText}</p>
        </div>
      )}
    </div>
  );
};

export default SlideContent;
