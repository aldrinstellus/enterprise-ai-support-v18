/**
 * Presentation Components - Index
 *
 * Central export for all presentation-related components.
 */

export { PresentationController } from './PresentationController';
export type {
  PresentationControllerProps,
  PresentationState,
  PresentationActions,
} from './PresentationController';

export { SlideRenderer } from './SlideRenderer';
export type { SlideRendererProps } from './SlideRenderer';

export { PresentationDeck } from './PresentationDeck';
export type { PresentationDeckProps } from './PresentationDeck';

// Future exports (Week 2):
// export { TitleSlide } from './slides/TitleSlide';
// export { OverviewSlide } from './slides/OverviewSlide';
// export { ContentSlide } from './slides/ContentSlide';
// export { MetricSlide } from './slides/MetricSlide';
// export { ClosingSlide } from './slides/ClosingSlide';
