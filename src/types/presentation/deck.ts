/**
 * Presentation Deck Type Definitions
 *
 * Types for managing collections of slides, variants, and deck metadata.
 */

import { PresentationSlide, SlideRenderOptions } from './slide';

/**
 * Presentation deck metadata
 */
export interface DeckMetadata {
  /** Deck title */
  title: string;

  /** Deck subtitle/description */
  subtitle?: string;

  /** Author name(s) */
  author?: string | string[];

  /** Company/organization */
  organization?: string;

  /** Creation date */
  createdAt: Date;

  /** Last modified date */
  updatedAt: Date;

  /** Version string (e.g., '1.0.0') */
  version?: string;

  /** Deck tags for categorization */
  tags?: string[];

  /** Estimated duration in milliseconds */
  estimatedDuration: number;

  /** Target audience (e.g., 'executives', 'technical') */
  targetAudience?: string[];

  /** Language code (e.g., 'en-US') */
  language?: string;
}

/**
 * Deck theme configuration
 */
export interface DeckTheme {
  /** Theme identifier */
  id: string;

  /** Theme display name */
  name: string;

  /** Primary brand color */
  primaryColor: string;

  /** Secondary brand color */
  secondaryColor?: string;

  /** Background color */
  backgroundColor: string;

  /** Text color */
  textColor: string;

  /** Heading font family */
  headingFont?: string;

  /** Body font family */
  bodyFont?: string;

  /** Logo URL or path */
  logoUrl?: string;

  /** Custom CSS variables */
  cssVariables?: Record<string, string>;
}

/**
 * Deck section for grouping slides
 */
export interface DeckSection {
  /** Section identifier */
  id: string;

  /** Section title */
  title: string;

  /** Section description */
  description?: string;

  /** Slide IDs in this section */
  slideIds: string[];

  /** Section color/theme override */
  color?: string;

  /** Is section collapsible in outline */
  collapsible?: boolean;
}

/**
 * Core Presentation Deck interface
 */
export interface PresentationDeck {
  /** Unique deck identifier */
  id: string;

  /** Deck metadata */
  metadata: DeckMetadata;

  /** All slides in the deck */
  slides: PresentationSlide[];

  /** Optional sections for organizing slides */
  sections?: DeckSection[];

  /** Deck theme configuration */
  theme?: DeckTheme;

  /** Rendering options for this deck */
  renderOptions?: SlideRenderOptions;

  /** First slide index to start from (default: 0) */
  startIndex?: number;

  /** Deck-level accessibility settings */
  accessibility?: {
    /** Enable high contrast mode */
    highContrast?: boolean;
    /** Text scaling factor (1.0 = normal) */
    textScale?: number;
    /** Enable reduced motion */
    reducedMotion?: boolean;
  };
}

/**
 * Deck variant for A/B testing or different audiences
 */
export interface DeckVariant {
  /** Variant identifier (e.g., 'gov-cio', 'gov-prog') */
  id: string;

  /** Display name */
  name: string;

  /** Base deck this variant extends */
  baseDeckId: string;

  /** Variant description */
  description?: string;

  /** Override metadata for this variant */
  metadataOverride?: Partial<DeckMetadata>;

  /** Slide IDs to include (if different from base) */
  slideIds?: string[];

  /** Slide IDs to exclude from base deck */
  excludeSlideIds?: string[];

  /** Theme override for this variant */
  themeOverride?: Partial<DeckTheme>;

  /** Target duration in milliseconds */
  targetDuration?: number;

  /** Is this the default variant */
  isDefault?: boolean;
}

/**
 * Deck export options
 */
export interface DeckExportOptions {
  /** Export format */
  format: 'pdf' | 'pptx' | 'html' | 'json' | 'markdown';

  /** Include presenter notes */
  includeNotes?: boolean;

  /** Include narration transcripts */
  includeTranscripts?: boolean;

  /** Quality setting (1-100) */
  quality?: number;

  /** Output file path */
  outputPath?: string;
}

/**
 * Deck analytics/metrics
 */
export interface DeckAnalytics {
  /** Total views */
  views: number;

  /** Average completion rate (0-1) */
  completionRate: number;

  /** Average time spent per slide (ms) */
  avgTimePerSlide: Record<string, number>;

  /** Drop-off points (slide IDs where users exit) */
  dropOffSlides: string[];

  /** Most replayed slides */
  replayedSlides: string[];

  /** User feedback scores */
  feedbackScores?: {
    overall: number;
    clarity: number;
    pacing: number;
    relevance: number;
  };
}
