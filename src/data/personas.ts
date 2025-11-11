import {
  TrendingUp,
  Users,
  Headphones,
  Target,
  AlertCircle,
  TrendingDown,
  Users as UsersIcon,
  Calendar,
  Activity,
  BarChart3,
  Clock,
  Zap,
  GitBranch,
  Bell,
  ArrowUpCircle,
  LayoutDashboard,
  Award,
  Ticket,
} from 'lucide-react';
import { Persona } from '@/types/persona';

export const personas: Persona[] = [
  // ===========================
  // C-LEVEL - Executive Dashboard
  // ===========================
  {
    id: 'c-level',
    name: 'Jennifer Anderson',
    email: 'jennifer.anderson@company.com',
    role: 'Chief Executive Officer',
    badge: {
      label: 'C-LEVEL',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    theme: {
      primary: 'oklch(0.58 0.2557 316.13)', // Purple (darkened for better contrast)
      accent: 'oklch(0.62 0.18 270)', // Deep blue
      badgeGradient: 'from-purple-500 via-blue-600 to-purple-500',
      badgeSolid: 'bg-purple-500',
      badgeRing: 'ring-purple-500/30',
    },
    quickActions: [
      {
        id: 'live-tickets',
        icon: Ticket,
        label: 'Live Tickets Dashboard',
        badge: 'New',
        badgeColor: 'bg-blue-500 text-white',
        query: 'Show me all my current tickets from Zoho Desk',
      },
      {
        id: 'sla-performance',
        icon: LayoutDashboard,
        label: 'SLA Performance',
        badge: '92%',
        badgeColor: 'bg-green-600 text-white',
        query: 'Show me SLA performance dashboard for this quarter',
      },
      {
        id: 'churn-risk',
        icon: TrendingDown,
        label: 'Churn Risk',
        badge: 5,
        badgeColor: 'bg-red-600 text-white',
        query: 'Which customers are at highest risk of churning?',
      },
      {
        id: 'exec-summary',
        icon: BarChart3,
        label: 'Executive Summary',
        badge: 'Q4',
        badgeColor: 'bg-purple-500 text-white',
        query: 'Generate comprehensive executive dashboard summary',
      },
      {
        id: 'board-metrics',
        icon: Award,
        label: 'Board Metrics',
        badge: 'Ready',
        badgeColor: 'bg-cyan-500 text-white',
        query: 'Prepare metrics for board meeting presentation',
      },
      {
        id: 'high-value',
        icon: Target,
        label: 'High-Value Accounts',
        badge: 18,
        badgeColor: 'bg-orange-500 text-white',
        query: 'Show me status of top 20 high-value customer accounts',
      },
      {
        id: 'strategic',
        icon: GitBranch,
        label: 'Strategic Initiatives',
        badge: 8,
        badgeColor: 'bg-green-600 text-white',
        query: 'Show me progress on strategic initiatives and OKRs',
      },
    ],
    demoScenarios: {
      'Executive Overview': [
        'Show me SLA performance for Q4 2025',
        'Which customers are at risk of churning?',
        'Executive dashboard summary for board meeting',
        'Revenue impact analysis from support tickets',
      ],
      'Customer Health': [
        'Show me customer satisfaction scores',
        'Top 10 accounts by revenue with health scores',
        'Escalation trends over last 3 months',
        'Customer retention metrics and forecasts',
      ],
      'Strategic Planning': [
        'Show me resource allocation efficiency',
        'Team capacity vs demand projections',
        'Integration ROI analysis',
        'Competitive positioning from customer feedback',
      ],
    },
    permissions: [
      'view_all_metrics',
      'view_financial_data',
      'view_customer_health',
      'view_strategic_initiatives',
      'view_sla_reports',
    ],
  },

  // ===========================
  // CS MANAGER - Team Operations
  // ===========================
  {
    id: 'cs-manager',
    name: 'David Miller',
    email: 'david.miller@company.com',
    role: 'Customer Support Operations Manager',
    badge: {
      label: 'CS MANAGER',
      icon: Users,
      color: 'text-teal-500',
    },
    theme: {
      primary: 'oklch(0.60 0.1446 235.91)', // Teal (darkened for better contrast)
      accent: 'oklch(0.70 0.14 200)', // Cyan
      badgeGradient: 'from-teal-500 via-cyan-600 to-teal-500',
      badgeSolid: 'bg-teal-500',
      badgeRing: 'ring-teal-500/30',
    },
    quickActions: [
      {
        id: 'live-tickets',
        icon: Ticket,
        label: 'Live Tickets Dashboard',
        badge: 'New',
        badgeColor: 'bg-blue-500 text-white',
        query: 'Show me all my current tickets from Zoho Desk',
      },
      {
        id: 'priority-customers',
        icon: AlertCircle,
        label: 'Priority Customers',
        badge: 12,
        badgeColor: 'bg-red-600 text-white',
        query: 'Show me all high-priority customers needing attention',
      },
      {
        id: 'agent-performance',
        icon: BarChart3,
        label: 'Agent Performance',
        badge: 'This Week',
        badgeColor: 'bg-teal-500 text-white',
        query: 'Show me agent performance metrics for this week',
      },
      {
        id: 'slacking-agent',
        icon: TrendingDown,
        label: 'Most Slacking Agent',
        badge: '!',
        badgeColor: 'bg-orange-500 text-white',
        query: 'Who is my most slacking agent this week?',
      },
      {
        id: 'top-performer',
        icon: Award,
        label: 'Top Performing Agent',
        badge: '⭐',
        badgeColor: 'bg-green-600 text-white',
        query: 'Who is my top performing agent this week?',
      },
      {
        id: 'workload-balance',
        icon: UsersIcon,
        label: 'Workload Balance',
        badge: 'View',
        badgeColor: 'bg-cyan-500 text-white',
        query: 'Show me agent workload distribution and recommend reassignments',
      },
      {
        id: 'sla-breach',
        icon: Clock,
        label: 'SLA Breach Alerts',
        badge: 3,
        badgeColor: 'bg-red-600 text-white',
        query: 'Show me tickets at risk of SLA breach',
      },
      {
        id: 'capacity',
        icon: Activity,
        label: 'Team Capacity',
        badge: '78%',
        badgeColor: 'bg-green-600 text-white',
        query: 'Show me team capacity and forecast for next week',
      },
      {
        id: 'escalations',
        icon: ArrowUpCircle,
        label: 'Escalation Queue',
        badge: 7,
        badgeColor: 'bg-orange-500 text-white',
        query: 'Show me all escalated tickets requiring manager attention',
      },
    ],
    demoScenarios: {
      'Team Performance': [
        'Show me agent performance for this week',
        'Who is my most slacking agent?',
        'Who is my top performing agent?',
        'Compare agent metrics: resolution time vs customer satisfaction',
      ],
      'Customer Management': [
        'Which customers need immediate attention?',
        'Show me all high-priority tickets by customer',
        'Customers with multiple open tickets',
        'Accounts with declining satisfaction scores',
      ],
      'Operations': [
        'Recommend ticket reassignments for workload balance',
        'Show me SLA breach risks for next 24 hours',
        'Team capacity planning for Q1 2026',
        'Escalation trends and root cause analysis',
      ],
    },
    permissions: [
      'view_team_metrics',
      'view_all_tickets',
      'reassign_tickets',
      'view_agent_performance',
      'escalate_tickets',
      'view_customer_data',
      'manage_team',
    ],
  },

  // ===========================
  // SUPPORT AGENT - Personal Queue
  // ===========================
  {
    id: 'support-agent',
    name: 'Christopher Hayes',
    email: 'christopher.hayes@company.com',
    role: 'Senior Support Engineer',
    badge: {
      label: 'SUPPORT AGENT',
      icon: Headphones,
      color: 'text-green-500',
    },
    theme: {
      primary: 'oklch(0.58 0.1688 149.18)', // Green (darkened for better contrast)
      accent: 'oklch(0.60 0.16 165)', // Emerald
      badgeGradient: 'from-green-500 via-emerald-600 to-green-500',
      badgeSolid: 'bg-green-500',
      badgeRing: 'ring-green-500/30',
    },
    quickActions: [
      {
        id: 'live-tickets',
        icon: Ticket,
        label: 'Live Tickets Dashboard',
        badge: 'New',
        badgeColor: 'bg-blue-500 text-white',
        query: 'Show me all my current tickets from Zoho Desk',
      },
      {
        id: 'my-tickets',
        icon: Target,
        label: 'My Open Tickets',
        badge: 18,
        badgeColor: 'bg-orange-500 text-white',
        query: 'Show me all my currently open support tickets',
      },
      {
        id: 'ai-resolved',
        icon: Zap,
        label: 'AI-Resolved Today',
        badge: 23,
        badgeColor: 'bg-green-600 text-white',
        query: 'How many tickets did AI resolve for me today?',
      },
      {
        id: 'escalated-to-me',
        icon: ArrowUpCircle,
        label: 'Escalated to Me',
        badge: 5,
        badgeColor: 'bg-red-600 text-white',
        query: 'Show me tickets escalated to me that need my attention',
      },
      {
        id: 'todays-meetings',
        icon: Calendar,
        label: "Today's Meetings",
        badge: 3,
        badgeColor: 'bg-cyan-500 text-white',
        query: 'Show me my scheduled customer meetings for today',
      },
      {
        id: 'jira-sync',
        icon: GitBranch,
        label: 'Jira Sync Status',
        badge: '✓',
        badgeColor: 'bg-green-600 text-white',
        query: 'Show me status of Jira issues linked to my tickets',
      },
      {
        id: 'urgent-alerts',
        icon: Bell,
        label: 'High-Priority Alerts',
        badge: 7,
        badgeColor: 'bg-red-600 text-white',
        query: 'Show me my urgent tickets and critical alerts',
      },
    ],
    demoScenarios: {
      'My Workload': [
        'Show me my tickets received in last 24 hours',
        'How many tickets did AI resolve for me?',
        'What are my urgent tickets right now?',
        'My ticket resolution rate this week',
      ],
      'Customer Interactions': [
        'Prep notes for my 2 PM customer call',
        'Show me conversation history with TechCorp Solutions',
        'Draft response for ticket DESK-1002',
        'Schedule follow-up meeting with CloudNine Technologies',
      ],
      'Productivity': [
        'Link ticket DESK-1002 to Jira issue PROJ-302',
        'Show me tickets I can close today',
        'AI-suggested canned responses for common issues',
        'My performance metrics vs team average',
      ],
    },
    permissions: [
      'view_own_tickets',
      'update_own_tickets',
      'view_customer_data',
      'link_jira_issues',
      'escalate_tickets',
      'view_own_meetings',
      'view_own_performance',
    ],
  },

  // ===========================
  // CSM - Customer Success Manager
  // ===========================
  {
    id: 'csm',
    name: 'Jordan Taylor',
    email: 'jordan.taylor@company.com',
    role: 'Customer Success Manager',
    badge: {
      label: 'CSM',
      icon: Target,
      color: 'text-cyan-500',
    },
    theme: {
      primary: 'oklch(0.68 0.14 210)', // Cyan
      accent: 'oklch(0.64 0.18 240)', // Blue
      badgeGradient: 'from-cyan-500 via-blue-500 to-cyan-500',
      badgeSolid: 'bg-cyan-500',
      badgeRing: 'ring-cyan-500/30',
    },
    quickActions: [
      {
        id: 'client-health',
        icon: Activity,
        label: 'Client Health Scores',
        badge: 'Live',
        badgeColor: 'bg-cyan-500 text-white',
        query: 'Show me health scores for my assigned clients',
      },
      {
        id: 'product-adoption',
        icon: TrendingUp,
        label: 'Product Adoption',
        badge: 'Metrics',
        badgeColor: 'bg-green-600 text-white',
        query: 'Show product adoption metrics and feature usage across clients',
      },
      {
        id: 'renewal-pipeline',
        icon: Calendar,
        label: 'Renewal Pipeline',
        badge: '12',
        badgeColor: 'bg-orange-500 text-white',
        query: 'Show upcoming renewals and contract status',
      },
      {
        id: 'client-feedback',
        icon: Bell,
        label: 'Client Feedback',
        badge: 'NPS',
        badgeColor: 'bg-purple-500 text-white',
        query: 'Show recent client feedback and NPS scores',
      },
      {
        id: 'upsell-opportunities',
        icon: ArrowUpCircle,
        label: 'Upsell Opportunities',
        badge: '$2.4M',
        badgeColor: 'bg-yellow-600 text-white',
        query: 'Identify upsell and cross-sell opportunities',
      },
      {
        id: 'product-roadmap',
        icon: GitBranch,
        label: 'Product Roadmap',
        badge: 'Q1',
        badgeColor: 'bg-blue-500 text-white',
        query: 'Show product roadmap and upcoming features',
      },
      {
        id: 'client-meetings',
        icon: Calendar,
        label: 'Client Meetings',
        badge: '8',
        badgeColor: 'bg-cyan-600 text-white',
        query: 'Schedule and manage client business reviews',
      },
    ],
    demoScenarios: {
      'Client Success': [
        'Show me health scores for all my assigned clients',
        'Which clients have declining product adoption?',
        'Show me clients at risk of churn this quarter',
        'Compare client engagement trends month-over-month',
      ],
      'Revenue Growth': [
        'Show upcoming renewals in next 90 days',
        'Identify expansion opportunities across my portfolio',
        'Show clients ready for premium tier upgrade',
        'Analyze revenue retention and expansion metrics',
      ],
      'Client Engagement': [
        'Show recent NPS survey results by client',
        'Which clients need business review meetings?',
        'Show product roadmap items most requested by clients',
        'Schedule quarterly business reviews for top accounts',
      ],
    },
    permissions: [
      'view_client_health',
      'view_product_adoption',
      'view_renewal_pipeline',
      'view_nps_scores',
      'manage_client_meetings',
      'view_upsell_opportunities',
      'view_product_roadmap',
      'view_client_feedback',
      'schedule_business_reviews',
      'view_expansion_metrics',
    ],
  },
];

// Helper function to get persona by ID
export const getPersonaById = (id: string): Persona | undefined => {
  return personas.find((p) => p.id === id);
};

// Default persona (Admin)
export const defaultPersona = personas[0];
