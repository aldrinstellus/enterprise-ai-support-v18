/**
 * Presentation Slide Type Definitions
 *
 * Core types for the presentation mode slide system.
 * Supports voice narration synchronization, WCAG 2.1 AA compliance.
 */

/**
 * Slide content types
 */
export type SlideType =
  | 'title'           // Title slide with main heading
  | 'overview'        // Overview/agenda slide
  | 'content'         // Standard content slide
  | 'metric'          // Metrics/statistics slide
  | 'workflow'        // Workflow diagram slide
  | 'comparison'      // Side-by-side comparison
  | 'demo'            // Live demo/video slide
  | 'closing'         // Closing/thank you slide;

/**
 * Slide transition animations
 */
export type SlideTransition =
  | 'none'
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom';

/**
 * Visual hierarchy for content
 */
export interface ContentBlock {
  id: string;
  type: 'heading' | 'subheading' | 'text' | 'bullet' | 'image' | 'chart' | 'code' | 'callout' | 'video';
  content: string;
  /** Optional style/variant (e.g., 'primary', 'secondary') */
  variant?: string;
  /** Order in which content appears during narration */
  order?: number;
  /** Alt text for images */
  alt?: string;
}

/**
 * Voice narration timing
 */
export interface NarrationSegment {
  /** Unique identifier for this segment */
  id: string;
  /** Spoken text */
  text: string;
  /** Start time in milliseconds */
  startTime: number;
  /** Duration in milliseconds */
  duration: number;
  /** Content blocks highlighted during this segment */
  highlightBlocks?: string[];
  /** Closed caption override (if different from text) */
  caption?: string;
}

/**
 * Keyboard shortcuts for slide navigation
 */
export interface SlideKeyboardShortcuts {
  next: string[];           // Default: ['ArrowRight', 'Space']
  previous: string[];       // Default: ['ArrowLeft']
  first: string[];          // Default: ['Home']
  last: string[];           // Default: ['End']
  play: string[];           // Default: ['p', 'P']
  toggleFullscreen: string[]; // Default: ['f', 'F11']
  toggleCaptions: string[];  // Default: ['c', 'C']
  toggleNarrator: string[];  // Default: ['n', 'N']
  fullscreen: string[];     // Default: ['f', 'F11']
  exit: string[];           // Default: ['Escape']
}

/**
 * Accessibility metadata per slide
 */
export interface SlideAccessibility {
  /** ARIA label for screen readers */
  ariaLabel: string;
  /** ARIA description for additional context */
  ariaDescription?: string;
  /** Skip link target (e.g., 'main-content') */
  skipLinkTarget?: string;
  /** Language code (e.g., 'en-US') */
  lang?: string;
}

/**
 * Core Presentation Slide interface
 */
export interface PresentationSlide {
  /** Unique slide identifier */
  id: string;

  /** Slide type determines layout and behavior */
  type: SlideType;

  /** Slide title (displayed in outline, navigation) */
  title: string;

  /** Subtitle or description */
  subtitle?: string;

  /** Content blocks composing this slide */
  content: ContentBlock[];

  /** Voice narration segments */
  narration: NarrationSegment[];

  /** Total duration of narration in milliseconds */
  duration: number;

  /** Transition animation when entering this slide */
  transition?: SlideTransition;

  /** Background color/gradient */
  background?: string;

  /** Accessibility metadata */
  accessibility: SlideAccessibility;

  /** Slide notes (presenter-only, not displayed) */
  notes?: string;

  /** Tags for categorization (e.g., 'intro', 'demo', 'metrics') */
  tags?: string[];

  /** Optional footer text */
  footer?: string;

  /** Hide slide from navigation (e.g., backup slides) */
  hidden?: boolean;

  /** Metadata for analytics */
  metadata?: Record<string, unknown>;
}

/**
 * Slide navigation state
 */
export interface SlideNavigationState {
  /** Current slide index (0-based) */
  currentIndex: number;

  /** Total number of slides */
  totalSlides: number;

  /** Is presentation in fullscreen mode */
  isFullscreen: boolean;

  /** Are closed captions visible */
  captionsEnabled: boolean;

  /** Is voice narrator playing */
  narratorPlaying: boolean;

  /** Is narrator audio muted */
  narratorMuted: boolean;

  /** Playback progress (0-1) for current slide */
  progress: number;

  /** Current narration segment index */
  currentSegmentIndex?: number;
}

/**
 * Slide rendering options
 */
export interface SlideRenderOptions {
  /** Show slide numbers */
  showSlideNumbers?: boolean;

  /** Show progress bar */
  showProgressBar?: boolean;

  /** Enable keyboard navigation */
  keyboardNavigation?: boolean;

  /** Custom keyboard shortcuts */
  shortcuts?: Partial<SlideKeyboardShortcuts>;

  /** Auto-advance slides after narration */
  autoAdvance?: boolean;

  /** Loop presentation */
  loop?: boolean;

  /** Enable mouse/touch gestures */
  gesturesEnabled?: boolean;
}
