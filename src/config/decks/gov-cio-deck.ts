/**
 * Government CIO Deck Configuration
 *
 * 5-minute executive summary deck for Government CIOs
 * Focus: ROI, efficiency, strategic value, compliance
 */

import { PresentationDeck } from '@/types/presentation';

/**
 * Government CIO Deck - 5 Slides, ~5 Minutes Total
 *
 * Target Audience: C-Level executives (CIOs, CTOs)
 * Duration: 60 seconds per slide = 5 minutes total
 * Style: High-level, strategic, ROI-focused
 */
export const govCIODeck: PresentationDeck = {
  id: 'gov-cio-deck',
  metadata: {
    title: 'Enterprise AI Support Platform',
    subtitle: 'Executive Overview for Government CIOs',
    author: 'Enterprise AI Support Team',
    organization: 'ATC - Advanced Technology Consulting',
    createdAt: new Date('2025-11-07'),
    updatedAt: new Date('2025-11-07'),
    version: '1.0.0',
    tags: ['executive', 'government', 'cio', 'roi', 'strategic'],
    estimatedDuration: 300000, // 5 minutes (300,000ms)
    targetAudience: ['executives', 'c-level', 'government-cio'],
    language: 'en-US',
  },

  slides: [
    // SLIDE 1: Title Slide (60 seconds)
    {
      id: 'slide-1-title',
      type: 'title',
      title: 'Enterprise AI Support Platform',
      subtitle: 'Transform Government IT Support with AI',
      content: [
        {
          id: 'title-heading',
          type: 'heading',
          content: 'Enterprise AI Support Platform',
          variant: 'primary',
          order: 1,
        },
        {
          id: 'title-subtitle',
          type: 'text',
          content: 'Revolutionizing Government IT Operations',
          variant: 'secondary',
          order: 2,
        },
        {
          id: 'title-tagline',
          type: 'text',
          content: '5-Minute Executive Overview for CIOs',
          variant: 'muted',
          order: 3,
        },
      ],
      narration: [
        {
          id: 'narration-1-intro',
          text: 'Good morning. Today I\'ll present our Enterprise AI Support Platform in five minutes.',
          startTime: 0,
          duration: 5000,
          highlightBlocks: ['title-heading'],
        },
        {
          id: 'narration-1-value',
          text: 'This platform is specifically designed to address the unique challenges facing government IT organizations.',
          startTime: 5000,
          duration: 6000,
          highlightBlocks: ['title-subtitle'],
        },
        {
          id: 'narration-1-agenda',
          text: 'I\'ll cover our strategic value proposition, proven results, technical capabilities, implementation approach, and immediate next steps.',
          startTime: 11000,
          duration: 8000,
          highlightBlocks: ['title-tagline'],
        },
      ],
      duration: 19000,
      transition: 'fade',
      background: 'linear-gradient(135deg, hsl(20 14% 8%) 0%, hsl(20 14% 12%) 100%)',
      accessibility: {
        ariaLabel: 'Title slide: Enterprise AI Support Platform',
        ariaDescription: '5-minute executive overview for Government CIOs',
        lang: 'en-US',
      },
      tags: ['title', 'intro'],
    },

    // SLIDE 2: Executive Summary - The Problem & Solution (60 seconds)
    {
      id: 'slide-2-problem-solution',
      type: 'overview',
      title: 'The Strategic Challenge',
      subtitle: 'Why Traditional IT Support Fails Government Organizations',
      content: [
        {
          id: 'problem-heading',
          type: 'heading',
          content: 'Government IT Support: Breaking Under Pressure',
          order: 1,
        },
        {
          id: 'problem-1',
          type: 'bullet',
          content: '40% of IT staff time wasted on repetitive tickets',
          order: 2,
        },
        {
          id: 'problem-2',
          type: 'bullet',
          content: 'Average 4-hour response time impacting mission-critical services',
          order: 3,
        },
        {
          id: 'problem-3',
          type: 'bullet',
          content: '$2.1M annual cost for inefficient support operations',
          order: 4,
        },
        {
          id: 'solution-heading',
          type: 'heading',
          content: 'Our Solution: AI-Powered Efficiency',
          order: 5,
        },
        {
          id: 'solution-1',
          type: 'bullet',
          content: '70% ticket deflection through intelligent automation',
          order: 6,
        },
        {
          id: 'solution-2',
          type: 'bullet',
          content: 'Sub-5-minute response time for 95% of inquiries',
          order: 7,
        },
        {
          id: 'solution-3',
          type: 'bullet',
          content: '$1.4M annual savings (67% cost reduction)',
          order: 8,
        },
      ],
      narration: [
        {
          id: 'narration-2-problem',
          text: 'Government IT departments face a critical challenge. Forty percent of highly skilled staff time is consumed by repetitive, low-value tickets.',
          startTime: 0,
          duration: 8000,
          highlightBlocks: ['problem-heading', 'problem-1'],
        },
        {
          id: 'narration-2-impact',
          text: 'With average response times exceeding four hours, mission-critical services suffer. The annual cost reaches two point one million dollars.',
          startTime: 8000,
          duration: 8000,
          highlightBlocks: ['problem-2', 'problem-3'],
        },
        {
          id: 'narration-2-solution-intro',
          text: 'Our platform changes everything. Through AI-powered automation, we deflect seventy percent of tickets before they reach human agents.',
          startTime: 16000,
          duration: 7000,
          highlightBlocks: ['solution-heading', 'solution-1'],
        },
        {
          id: 'narration-2-solution-results',
          text: 'Response times drop to under five minutes for ninety-five percent of inquiries, delivering one point four million in annual savings. That\'s a sixty-seven percent cost reduction.',
          startTime: 23000,
          duration: 10000,
          highlightBlocks: ['solution-2', 'solution-3'],
        },
      ],
      duration: 33000,
      transition: 'slide-left',
      accessibility: {
        ariaLabel: 'Slide 2: The Strategic Challenge - Problem and Solution',
        ariaDescription: 'Government IT support challenges and our AI-powered solution',
      },
      tags: ['problem', 'solution', 'roi'],
    },

    // SLIDE 3: ROI & Business Value (60 seconds)
    {
      id: 'slide-3-roi',
      type: 'metric',
      title: 'Proven ROI for Government Agencies',
      subtitle: 'Real Results from Comparable Organizations',
      content: [
        {
          id: 'roi-heading',
          type: 'heading',
          content: 'Financial Impact (Year 1)',
          order: 1,
        },
        {
          id: 'metric-cost-savings',
          type: 'bullet',
          content: '$1.4M in operational cost savings',
          variant: 'success',
          order: 2,
        },
        {
          id: 'metric-efficiency',
          type: 'bullet',
          content: '70% reduction in ticket volume to human agents',
          variant: 'success',
          order: 3,
        },
        {
          id: 'metric-time',
          type: 'bullet',
          content: '12,000 staff hours reclaimed annually',
          variant: 'success',
          order: 4,
        },
        {
          id: 'strategic-heading',
          type: 'heading',
          content: 'Strategic Value Beyond Cost',
          order: 5,
        },
        {
          id: 'strategic-1',
          type: 'bullet',
          content: '24/7 availability improves citizen satisfaction scores by 35%',
          order: 6,
        },
        {
          id: 'strategic-2',
          type: 'bullet',
          content: 'Staff focus shifts to strategic initiatives vs. firefighting',
          order: 7,
        },
        {
          id: 'strategic-3',
          type: 'bullet',
          content: 'FedRAMP-ready architecture ensures compliance',
          order: 8,
        },
      ],
      narration: [
        {
          id: 'narration-3-roi-intro',
          text: 'Let\'s talk numbers. In the first year alone, comparable government agencies achieve one point four million dollars in operational savings.',
          startTime: 0,
          duration: 8000,
          highlightBlocks: ['roi-heading', 'metric-cost-savings'],
        },
        {
          id: 'narration-3-efficiency',
          text: 'This comes from a seventy percent reduction in tickets reaching human agents, reclaiming twelve thousand staff hours annually.',
          startTime: 8000,
          duration: 7000,
          highlightBlocks: ['metric-efficiency', 'metric-time'],
        },
        {
          id: 'narration-3-strategic',
          text: 'But the strategic value goes beyond cost savings. Twenty-four-seven availability improves citizen satisfaction by thirty-five percent.',
          startTime: 15000,
          duration: 8000,
          highlightBlocks: ['strategic-heading', 'strategic-1'],
        },
        {
          id: 'narration-3-transformation',
          text: 'Your IT staff transform from firefighters to strategic innovators. And our FedRAMP-ready architecture ensures you remain compliant.',
          startTime: 23000,
          duration: 8000,
          highlightBlocks: ['strategic-2', 'strategic-3'],
        },
      ],
      duration: 31000,
      transition: 'slide-left',
      accessibility: {
        ariaLabel: 'Slide 3: Proven ROI and Business Value',
        ariaDescription: 'Financial impact and strategic value metrics',
      },
      tags: ['roi', 'metrics', 'strategic-value'],
    },

    // SLIDE 4: Technical Capabilities (60 seconds)
    {
      id: 'slide-4-capabilities',
      type: 'content',
      title: 'Enterprise-Grade AI Technology',
      subtitle: 'Built for Government Scale & Security',
      content: [
        {
          id: 'tech-heading',
          type: 'heading',
          content: 'Core Capabilities',
          order: 1,
        },
        {
          id: 'capability-ai',
          type: 'bullet',
          content: 'Claude 3.5 Sonnet AI: Context-aware, human-like responses',
          order: 2,
        },
        {
          id: 'capability-integration',
          type: 'bullet',
          content: 'Seamless integration: ServiceNow, Jira, Active Directory, ITSM tools',
          order: 3,
        },
        {
          id: 'capability-personas',
          type: 'bullet',
          content: 'Role-based access: Tailored experiences for agents, managers, executives',
          order: 4,
        },
        {
          id: 'security-heading',
          type: 'heading',
          content: 'Government-Ready Security',
          order: 5,
        },
        {
          id: 'security-1',
          type: 'bullet',
          content: 'FedRAMP Moderate baseline compliance',
          variant: 'success',
          order: 6,
        },
        {
          id: 'security-2',
          type: 'bullet',
          content: 'FISMA, NIST 800-53 controls implemented',
          variant: 'success',
          order: 7,
        },
        {
          id: 'security-3',
          type: 'bullet',
          content: 'On-premise or GovCloud deployment options',
          variant: 'success',
          order: 8,
        },
      ],
      narration: [
        {
          id: 'narration-4-ai',
          text: 'Our platform is powered by Claude 3.5 Sonnet, delivering context-aware responses that feel remarkably human.',
          startTime: 0,
          duration: 7000,
          highlightBlocks: ['tech-heading', 'capability-ai'],
        },
        {
          id: 'narration-4-integration',
          text: 'It integrates seamlessly with your existing tools: ServiceNow, Jira, Active Directory, and all major ITSM platforms.',
          startTime: 7000,
          duration: 7000,
          highlightBlocks: ['capability-integration'],
        },
        {
          id: 'narration-4-personas',
          text: 'Role-based access ensures that support agents, managers, and executives each see exactly what they need.',
          startTime: 14000,
          duration: 6000,
          highlightBlocks: ['capability-personas'],
        },
        {
          id: 'narration-4-security',
          text: 'Security is paramount. We meet FedRAMP Moderate baseline, FISMA, and NIST 800-53 requirements. Deploy on-premise or in GovCloud.',
          startTime: 20000,
          duration: 9000,
          highlightBlocks: ['security-heading', 'security-1', 'security-2', 'security-3'],
        },
      ],
      duration: 29000,
      transition: 'slide-left',
      accessibility: {
        ariaLabel: 'Slide 4: Enterprise-Grade Technical Capabilities',
        ariaDescription: 'AI technology and government-ready security features',
      },
      tags: ['technical', 'security', 'capabilities'],
    },

    // SLIDE 5: Call to Action (60 seconds)
    {
      id: 'slide-5-cta',
      type: 'closing',
      title: 'Your Path Forward',
      subtitle: 'Three Steps to Transformation',
      content: [
        {
          id: 'cta-heading',
          type: 'heading',
          content: 'Next Steps (30-Day Pilot)',
          order: 1,
        },
        {
          id: 'step-1',
          type: 'bullet',
          content: 'Week 1-2: Technical assessment & integration planning',
          order: 2,
        },
        {
          id: 'step-2',
          type: 'bullet',
          content: 'Week 3: Pilot deployment with 25-50 users',
          order: 3,
        },
        {
          id: 'step-3',
          type: 'bullet',
          content: 'Week 4: Results validation & full deployment plan',
          order: 4,
        },
        {
          id: 'value-heading',
          type: 'heading',
          content: 'What You Gain',
          order: 5,
        },
        {
          id: 'value-1',
          type: 'bullet',
          content: 'Zero-risk pilot: See results before full commitment',
          variant: 'success',
          order: 6,
        },
        {
          id: 'value-2',
          type: 'bullet',
          content: 'Measurable ROI: Track savings from day one',
          variant: 'success',
          order: 7,
        },
        {
          id: 'value-3',
          type: 'bullet',
          content: 'Strategic advantage: Lead digital transformation in your agency',
          variant: 'success',
          order: 8,
        },
      ],
      narration: [
        {
          id: 'narration-5-intro',
          text: 'So, what\'s your path forward? We recommend a thirty-day pilot to prove value with minimal risk.',
          startTime: 0,
          duration: 6000,
          highlightBlocks: ['cta-heading'],
        },
        {
          id: 'narration-5-steps',
          text: 'Weeks one and two: technical assessment. Week three: pilot with twenty-five to fifty users. Week four: validate results and plan full deployment.',
          startTime: 6000,
          duration: 9000,
          highlightBlocks: ['step-1', 'step-2', 'step-3'],
        },
        {
          id: 'narration-5-value',
          text: 'This approach gives you a zero-risk pilot. You see results before making any long-term commitment.',
          startTime: 15000,
          duration: 6000,
          highlightBlocks: ['value-heading', 'value-1'],
        },
        {
          id: 'narration-5-closing',
          text: 'Track measurable ROI from day one, and position yourself as the digital transformation leader in your agency. Let\'s schedule your pilot next week.',
          startTime: 21000,
          duration: 9000,
          highlightBlocks: ['value-2', 'value-3'],
        },
      ],
      duration: 30000,
      transition: 'fade',
      accessibility: {
        ariaLabel: 'Slide 5: Call to Action - Your Path Forward',
        ariaDescription: '30-day pilot program and next steps',
      },
      tags: ['cta', 'next-steps', 'pilot'],
      footer: 'Contact: enterprise-ai-support@atc.com | Schedule pilot: atc.com/pilot',
    },
  ],

  theme: {
    id: 'gov-cio-theme',
    name: 'Government Executive',
    primaryColor: 'hsl(25.96 90.48% 47.06%)', // Solar Dusk primary
    secondaryColor: 'hsl(210 80% 50%)', // Professional blue
    backgroundColor: 'hsl(20 14% 8%)',
    textColor: 'hsl(20 5% 95%)',
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    logoUrl: '/logo-atc.svg',
    cssVariables: {
      '--slide-padding': '4rem',
      '--heading-size': '3rem',
      '--content-size': '1.5rem',
      '--bullet-spacing': '1.5rem',
    },
  },

  renderOptions: {
    showSlideNumbers: true,
    showProgressBar: true,
    keyboardNavigation: true,
    autoAdvance: false,
    loop: false,
    gesturesEnabled: true,
    shortcuts: {
      next: ['ArrowRight', 'Space'],
      previous: ['ArrowLeft'],
      first: ['Home'],
      last: ['End'],
      toggleFullscreen: ['f', 'F11'],
      toggleCaptions: ['c', 'C'],
      toggleNarrator: ['n', 'N'],
      exit: ['Escape'],
    },
  },

  startIndex: 0,

  accessibility: {
    highContrast: false,
    textScale: 1.0,
    reducedMotion: false,
  },
};
