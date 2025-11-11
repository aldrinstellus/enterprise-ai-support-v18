import type {
  WidgetType,
  WidgetData,
  ExecutiveSummaryData,
  AnalyticsDashboardData,
  PerformanceTrendsData,
  SentimentAnalysisData,
  CustomerRiskProfileData,
  TeamWorkloadDashboardData,
  SLAPerformanceChartData,
  AgentDashboardData,
  TicketDetailData,
  LiveTicketDetailData,
  AgentPerformanceComparisonData,
  CustomerRiskListData,
  MeetingSchedulerData,
  MeetingConfirmationData,
  CallPrepNotesData,
  ResponseComposerData,
  SimilarTicketsAnalysisData,
  AgentPerformanceStatsData,
  KnowledgeBaseSearchData,
  KnowledgeArticleData,
  MessageComposerData,
  EscalationPathData,
  SystemAccessStatusData,
  InteractiveUpdateData,
  TicketProcessingData,
} from '@/types/widget';
import { ExecutiveSummaryWidget } from './ExecutiveSummaryWidget';
import { AnalyticsDashboardWidget } from './AnalyticsDashboardWidget';
import { PerformanceTrendsWidget } from './PerformanceTrendsWidget';
import { SentimentAnalysisWidget } from './SentimentAnalysisWidget';
import { CustomerRiskProfileWidget } from './CustomerRiskProfileWidget';
import { LiveTicketListWidget } from './LiveTicketListWidget';
import { LiveTicketDetailWidget } from './LiveTicketDetailWidget';
import { AgentDashboardWidget } from './AgentDashboardWidget';
import { TeamWorkloadDashboardWidget } from './TeamWorkloadDashboardWidget';
import { MeetingSchedulerWidget } from './MeetingSchedulerWidget';
import { MeetingConfirmationWidget } from './MeetingConfirmationWidget';
import { CustomerRiskListWidget } from './CustomerRiskListWidget';
import { TicketDetailWidget } from './TicketDetailWidget';
import { SLAPerformanceChartWidget } from './SLAPerformanceChartWidget';
import { AgentPerformanceComparisonWidget } from './AgentPerformanceComparisonWidget';
import { CallPrepNotesWidget } from './CallPrepNotesWidget';
import { ResponseComposerWidget } from './ResponseComposerWidget';
import { SimilarTicketsAnalysisWidget } from './SimilarTicketsAnalysisWidget';
import { AgentPerformanceStatsWidget } from './AgentPerformanceStatsWidget';
import { KnowledgeBaseSearchWidget } from './KnowledgeBaseSearchWidget';
import { KnowledgeArticleWidget } from './KnowledgeArticleWidget';
import { MessageComposerWidget } from './MessageComposerWidget';
import { EscalationPathWidget } from './EscalationPathWidget';
import { SystemAccessStatusWidget } from './SystemAccessStatusWidget';
import { InteractiveUpdateWidget } from './InteractiveUpdateWidget';
import { TicketProcessingWidget } from './TicketProcessingWidget';

interface WidgetRendererProps {
  type: WidgetType;
  data: WidgetData;
  onAction?: (action: string) => void;
}

export function WidgetRenderer({ type, data, onAction }: WidgetRendererProps) {
  // Render widget component based on type
  const renderWidget = () => {
    switch (type) {
      case 'executive-summary':
        return <ExecutiveSummaryWidget data={data as ExecutiveSummaryData} />;

      case 'analytics-dashboard':
        return <AnalyticsDashboardWidget data={data as AnalyticsDashboardData} />;

      case 'performance-trends':
        return <PerformanceTrendsWidget data={data as PerformanceTrendsData} />;

      case 'sentiment-analysis':
        return <SentimentAnalysisWidget data={data as SentimentAnalysisData} />;

      case 'customer-risk-profile':
        return <CustomerRiskProfileWidget data={data as CustomerRiskProfileData} />;

      case 'ticket-list':
        return <LiveTicketListWidget />;

      case 'agent-dashboard':
        return <AgentDashboardWidget data={data as AgentDashboardData} />;

      case 'team-workload-dashboard':
        return <TeamWorkloadDashboardWidget data={data as TeamWorkloadDashboardData} />;

      case 'meeting-scheduler':
        return <MeetingSchedulerWidget data={data as MeetingSchedulerData} />;

      case 'meeting-confirmation':
        return <MeetingConfirmationWidget data={data as MeetingConfirmationData} />;

      case 'customer-risk-list':
        return <CustomerRiskListWidget data={data as CustomerRiskListData} />;

      case 'ticket-detail':
        return <TicketDetailWidget data={data as TicketDetailData} />;

      case 'live-ticket-detail':
        return <LiveTicketDetailWidget ticketNumber={(data as LiveTicketDetailData).ticketNumber} />;

      case 'sla-performance-chart':
        return <SLAPerformanceChartWidget data={data as SLAPerformanceChartData} />;

      case 'agent-performance-comparison':
        return <AgentPerformanceComparisonWidget data={data as AgentPerformanceComparisonData} />;

      case 'call-prep-notes':
        return <CallPrepNotesWidget data={data as CallPrepNotesData} />;

      case 'response-composer':
        return <ResponseComposerWidget data={data as ResponseComposerData} onAction={onAction} />;

      case 'similar-tickets-analysis':
        return <SimilarTicketsAnalysisWidget data={data as SimilarTicketsAnalysisData} />;

      case 'agent-performance-stats':
        return <AgentPerformanceStatsWidget data={data as AgentPerformanceStatsData} />;

      case 'knowledge-base-search':
        return <KnowledgeBaseSearchWidget data={data as KnowledgeBaseSearchData} />;

      case 'knowledge-article':
        return <KnowledgeArticleWidget data={data as KnowledgeArticleData} />;

      case 'message-composer':
        return <MessageComposerWidget data={data as MessageComposerData} onAction={onAction} />;

      case 'escalation-path':
        return <EscalationPathWidget data={data as EscalationPathData} />;

      case 'system-access-status':
        return <SystemAccessStatusWidget data={data as SystemAccessStatusData} />;

      case 'interactive-update':
        return <InteractiveUpdateWidget data={data as InteractiveUpdateData} />;

      case 'ticket-processing':
        return <TicketProcessingWidget data={data as TicketProcessingData} />;

      default:
        // Fallback for unimplemented widgets
        return (
          <div className="my-4 rounded-lg border border-chart-4/30 bg-chart-4/5 p-4">
            <p className="text-sm text-muted-foreground">
              Widget type <span className="font-mono font-semibold text-foreground">{type}</span> is not yet implemented.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              This widget is coming soon. For now, check the data in the browser console.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-3">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  View raw data (development only)
                </summary>
                <pre className="mt-2 text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        );
    }
  };

  // Wrap widget in container with data-widget-type for E2E testing
  return (
    <div data-widget-type={type}>
      {renderWidget()}
    </div>
  );
}
