/**
 * API Route: Fetch Single Ticket Details from Zoho Desk
 * Provides comprehensive ticket data including conversations and metadata
 */

import { NextRequest, NextResponse } from 'next/server';
import { getZohoDeskClient } from '@/lib/integrations/zoho-desk';
import { ZohoConversation as ImportedZohoConversation } from '@/types/zoho';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    ticketNumber: string;
  }>;
}

// Zoho API Response Types
interface ZohoContact {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
}

interface ZohoAssignee {
  id?: string;
  name?: string;
  email?: string;
}

interface ZohoDepartment {
  name?: string;
}

interface ZohoCategory {
  name?: string;
}

interface ZohoProduct {
  productName?: string;
}

interface ZohoAttachment {
  id: string;
  name: string;
  size?: number;
  href?: string;
}

interface ZohoConversation {
  id: string;
  direction?: string;
  summary?: string;
  content?: string;
  contentType?: string;
  from?: string;
  to?: string;
  cc?: string[];
  bcc?: string[];
  author?: string | { name?: string };
  createdTime: string;
  isPublic?: boolean;
  attachments?: ZohoAttachment[];
}

interface ZohoTicket {
  id: string;
  ticketNumber: string;
  subject?: string;
  description?: string;
  priority?: string;
  status?: string;
  channel?: string;
  contact?: ZohoContact;
  assignee?: ZohoAssignee;
  createdTime: string;
  modifiedTime?: string;
  closedTime?: string;
  dueDate?: string;
  department?: ZohoDepartment;
  category?: ZohoCategory;
  subCategory?: string;
  productId?: ZohoProduct;
  cf?: Record<string, unknown>;
  responseDue?: string;
  resolutionDue?: string;
  isResponseOverdue?: boolean;
  isOverDue?: boolean;
  tags?: string[];
  webUrl?: string;
  commentCount?: number;
  threadCount?: number;
  attachmentCount?: number;
}

interface ZohoTicketResponse {
  data: ZohoTicket[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ZohoConversationsResponse {
  data: ZohoConversation[];
}

/**
 * GET /api/tickets/[ticketNumber]
 * Fetch detailed information for a specific ticket
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { ticketNumber } = await context.params;

    if (!ticketNumber) {
      return NextResponse.json(
        { success: false, error: 'Ticket number is required' },
        { status: 400 }
      );
    }

    const zohoClient = getZohoDeskClient();

    // First, search for the ticket by ticket number
    // Zoho API requires us to get the list and filter by ticketNumber
    const searchResponse = await zohoClient.request<ZohoTicketResponse>(
      `/api/v1/tickets?limit=100&sortBy=-createdTime`
    );

    // Find the ticket with matching ticketNumber
    const ticket = searchResponse.data?.find((t: ZohoTicket) => t.ticketNumber === ticketNumber);

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: `Ticket #${ticketNumber} not found` },
        { status: 404 }
      );
    }

    // Fetch conversations/threads for the ticket
    let conversations: ImportedZohoConversation[] = [];
    try {
      const conversationsResponse = await zohoClient.getConversations(ticket.id);
      conversations = conversationsResponse.data || [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('[API /tickets/[ticketNumber]] Failed to fetch conversations:', errorMessage);
      // Continue without conversations
    }

    // Transform to detailed ticket format
    const detailedTicket = {
      // Basic Info
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject || 'No subject',
      description: ticket.description || '',
      priority: mapPriority(ticket.priority),
      status: ticket.status || 'Open',
      channel: ticket.channel || 'Unknown',

      // Customer/Contact Info
      contact: {
        name: [ticket.contact?.firstName, ticket.contact?.lastName]
          .filter(Boolean)
          .join(' ') || 'Unknown',
        email: ticket.contact?.email || '',
        phone: ticket.contact?.phone || ticket.contact?.mobile || '',
        id: ticket.contact?.id || '',
      },

      // Assignment
      assignee: {
        name: ticket.assignee?.name || null,
        email: ticket.assignee?.email || null,
        id: ticket.assignee?.id || null,
      },

      // Metadata
      createdTime: ticket.createdTime,
      modifiedTime: ticket.modifiedTime || ticket.createdTime,
      closedTime: ticket.closedTime,
      dueDate: ticket.dueDate,

      // Categorization
      department: ticket.department?.name || null,
      category: ticket.category?.name || null,
      subCategory: ticket.subCategory || null,
      product: ticket.productId?.productName || null,

      // Custom Fields
      customFields: ticket.cf || {},

      // SLA Tracking
      sla: {
        responseDue: ticket.responseDue,
        resolutionDue: ticket.resolutionDue,
        responseOverdue: ticket.isResponseOverdue || false,
        resolutionOverdue: ticket.isOverDue || false,
      },

      // Conversations/Timeline
      conversations: conversations.map((conv: ImportedZohoConversation) => ({
        id: conv.id,
        direction: conv.direction?.toUpperCase() || 'INTERNAL', // in -> INCOMING, out -> OUTGOING
        summary: conv.summary || '',
        content: conv.content || conv.summary || '',
        contentType: conv.contentType || 'plainText',
        from: conv.from || '',
        to: conv.to || '',
        cc: conv.cc || [],
        bcc: conv.bcc || [],
        author: typeof conv.author === 'string' ? conv.author : conv.author?.name || 'Unknown',
        createdTime: conv.createdTime,
        isPublic: true,
        attachments: (conv.attachments || []).map((att: ZohoAttachment) => ({
          id: att.id,
          name: att.name,
          size: att.size,
          href: att.href,
        })),
      })),

      // Tags
      tags: ticket.tags || [],

      // Additional metadata
      webUrl: ticket.webUrl || '',
      commentCount: ticket.commentCount || 0,
      threadCount: ticket.threadCount || 0,
      attachmentCount: ticket.attachmentCount || 0,
    };

    return NextResponse.json({
      success: true,
      ticket: detailedTicket,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ticket details';
    console.error('[API /tickets/[ticketNumber]] Error:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Map Zoho priority to standard format
 */
function mapPriority(zohoPriority: string | undefined): 'High' | 'Medium' | 'Low' {
  const priority = (zohoPriority || '').toLowerCase();

  if (priority === 'high' || priority === 'urgent') {
    return 'High';
  } else if (priority === 'low') {
    return 'Low';
  }

  return 'Medium';
}
