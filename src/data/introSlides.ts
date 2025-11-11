/**
 * Intro Slides Data
 *
 * Professional presentation slides shown before the main demo
 * to engage the audience during the initial voice introduction.
 *
 * Phase 3: Presentation Polish
 */

import { PresentationSlide } from '@/types/presentation';

export const introSlides: PresentationSlide[] = [
  {
    id: 'intro-1',
    type: 'title',
    title: 'AI-Enhanced Customer Support Services',
    subtitle: 'Saving Costs and Improving Performance',
    content: [
      {
        id: 'title-1',
        type: 'heading',
        content: 'AI-Enhanced Customer Support Services',
        order: 1,
      },
      {
        id: 'subtitle-1',
        type: 'subheading',
        content: 'Saving Costs and Improving Performance',
        order: 2,
      },
    ],
    narration: [
      {
        id: 'narr-1',
        text: 'Welcome to our AI-Enhanced Customer Support demonstration',
        startTime: 0,
        duration: 3000,
        highlightBlocks: ['title-1', 'subtitle-1'],
      },
    ],
    duration: 3000,
    transition: 'fade',
    background: 'linear-gradient(135deg, hsl(20 14% 8%) 0%, hsl(25.96 90.48% 47.06% / 0.1) 100%)',
    accessibility: {
      ariaLabel: 'Title slide: AI-Enhanced Customer Support Services',
      ariaDescription: 'Introduction to AI-powered customer support platform',
      lang: 'en-US',
    },
    tags: ['intro', 'title'],
  },
  {
    id: 'intro-2',
    type: 'overview',
    title: 'Multi-Persona Support System',
    subtitle: 'Tailored Experiences for Every Role',
    content: [
      {
        id: 'heading-2',
        type: 'heading',
        content: 'Multi-Persona Support System',
        order: 1,
      },
      {
        id: 'bullet-1',
        type: 'bullet',
        content: 'Executive Dashboard - Strategic insights and KPIs',
        order: 2,
      },
      {
        id: 'bullet-2',
        type: 'bullet',
        content: 'Team Operations - Performance monitoring and optimization',
        order: 3,
      },
      {
        id: 'bullet-3',
        type: 'bullet',
        content: 'Agent Productivity - Real-time assistance and automation',
        order: 4,
      },
      {
        id: 'bullet-4',
        type: 'bullet',
        content: 'Client Success - Relationship management and retention',
        order: 5,
      },
    ],
    narration: [
      {
        id: 'narr-2',
        text: 'Our platform supports four distinct personas, each with tailored experiences',
        startTime: 0,
        duration: 5000,
        highlightBlocks: ['heading-2', 'bullet-1', 'bullet-2', 'bullet-3', 'bullet-4'],
      },
    ],
    duration: 5000,
    transition: 'fade',
    background: 'linear-gradient(135deg, hsl(20 14% 8%) 0%, hsl(25.96 90.48% 47.06% / 0.1) 100%)',
    accessibility: {
      ariaLabel: 'Overview slide: Multi-Persona Support System with four key roles',
      ariaDescription: 'Four personas: Executive, Manager, Agent, and Client Success Manager',
      lang: 'en-US',
    },
    tags: ['intro', 'overview', 'personas'],
  },
  {
    id: 'intro-3',
    type: 'metric',
    title: 'Key Benefits',
    subtitle: 'Measurable Impact on Your Bottom Line',
    content: [
      {
        id: 'heading-3',
        type: 'heading',
        content: 'Key Benefits',
        order: 1,
      },
      {
        id: 'metric-1',
        type: 'callout',
        content: '40% reduction in support costs',
        variant: 'primary',
        order: 2,
      },
      {
        id: 'metric-2',
        type: 'callout',
        content: '2x faster resolution times',
        variant: 'primary',
        order: 3,
      },
      {
        id: 'metric-3',
        type: 'callout',
        content: '95% customer satisfaction',
        variant: 'primary',
        order: 4,
      },
      {
        id: 'metric-4',
        type: 'callout',
        content: 'Real-time AI assistance for every ticket',
        variant: 'secondary',
        order: 5,
      },
    ],
    narration: [
      {
        id: 'narr-3',
        text: 'Our AI-powered platform delivers measurable results across all metrics',
        startTime: 0,
        duration: 5000,
        highlightBlocks: ['heading-3', 'metric-1', 'metric-2', 'metric-3', 'metric-4'],
      },
    ],
    duration: 5000,
    transition: 'fade',
    background: 'linear-gradient(135deg, hsl(20 14% 8%) 0%, hsl(25.96 90.48% 47.06% / 0.1) 100%)',
    accessibility: {
      ariaLabel: 'Metrics slide: Key Benefits showing 40% cost reduction, 2x faster resolution, and 95% satisfaction',
      ariaDescription: 'Performance metrics demonstrating platform effectiveness',
      lang: 'en-US',
    },
    tags: ['intro', 'metrics', 'benefits'],
  },
  {
    id: 'intro-4',
    type: 'content',
    title: 'Enterprise-Ready Features',
    subtitle: 'Built for Scale and Security',
    content: [
      {
        id: 'heading-4',
        type: 'heading',
        content: 'Enterprise-Ready Features',
        order: 1,
      },
      {
        id: 'feature-1',
        type: 'bullet',
        content: 'Role-based access control (RBAC) with granular permissions',
        order: 2,
      },
      {
        id: 'feature-2',
        type: 'bullet',
        content: 'Real-time WebSocket communication for instant updates',
        order: 3,
      },
      {
        id: 'feature-3',
        type: 'bullet',
        content: 'Integration with Zoho Desk, Jira, Slack, and more',
        order: 4,
      },
      {
        id: 'feature-4',
        type: 'bullet',
        content: 'WCAG 2.1 Level AA accessibility compliance',
        order: 5,
      },
    ],
    narration: [
      {
        id: 'narr-4',
        text: 'Built on enterprise-grade infrastructure with security and scalability at its core',
        startTime: 0,
        duration: 5000,
        highlightBlocks: ['heading-4', 'feature-1', 'feature-2', 'feature-3', 'feature-4'],
      },
    ],
    duration: 5000,
    transition: 'fade',
    background: 'linear-gradient(135deg, hsl(20 14% 8%) 0%, hsl(25.96 90.48% 47.06% / 0.1) 100%)',
    accessibility: {
      ariaLabel: 'Features slide: Enterprise-Ready capabilities including RBAC, WebSocket, integrations, and accessibility',
      ariaDescription: 'Enterprise features for security, scalability, and integration',
      lang: 'en-US',
    },
    tags: ['intro', 'features', 'enterprise'],
  },
];

/**
 * Calculate total intro slides duration
 */
export const getTotalIntroDuration = (): number => {
  return introSlides.reduce((total, slide) => total + slide.duration, 0);
};

/**
 * Get intro slide by ID
 */
export const getIntroSlideById = (id: string): PresentationSlide | undefined => {
  return introSlides.find(slide => slide.id === id);
};

/**
 * Get intro slide by index
 */
export const getIntroSlideByIndex = (index: number): PresentationSlide | undefined => {
  return introSlides[index];
};
