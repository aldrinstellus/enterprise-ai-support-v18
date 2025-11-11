/**
 * API Route: Fetch Tickets from Supabase Database
 * Provides ticket data formatted for dashboard consumption
 * NO JOINS - Uses only the tickets table as per requirement
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TicketPriority, TicketStatus, Prisma } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface DashboardTicket {
  id: string;
  ticketNumber: string;
  summary: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  status: string;
  assignedAgent: string | null;
  reporter: string;
  reporterEmail: string;
  createdDate: string;
  lastUpdated: string;
  category: string | null;
  channel: string;
  aiProcessed: boolean;
  aiClassification: string | null;
}

/**
 * GET /api/tickets
 * Fetch recent tickets from Supabase database (tickets table only - NO JOINS)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const statusFilter = searchParams.get('status'); // Open, In Progress, Closed

    // Build Prisma query - NO JOINS, only tickets table
    const whereClause: Prisma.TicketWhereInput = {};

    if (statusFilter) {
      // Map URL status to TicketStatus enum
      const statusMap: { [key: string]: TicketStatus } = {
        'Open': TicketStatus.OPEN,
        'In Progress': TicketStatus.IN_PROGRESS,
        'Closed': TicketStatus.CLOSED,
        'Resolved': TicketStatus.RESOLVED,
        'Pending': TicketStatus.PENDING,
        'Escalated': TicketStatus.ESCALATED,
      };
      whereClause.status = statusMap[statusFilter] || TicketStatus.OPEN;
    }

    // Fetch tickets from Supabase (NO JOINS - tickets table only)
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Transform database tickets to dashboard format
    // NO JOINS - reporter/assignee will be IDs only (as per user requirement)
    const dashboardTickets: DashboardTicket[] = tickets.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      summary: ticket.subject,
      priority: mapPrismaPriority(ticket.priority),
      status: mapPrismaStatus(ticket.status),
      assignedAgent: ticket.assigneeId || null, // ID only (no join to User table)
      reporter: ticket.customerId, // ID only (no join to Customer table)
      reporterEmail: 'N/A', // Not available without join to Customer table
      createdDate: ticket.createdAt.toISOString(),
      lastUpdated: ticket.updatedAt.toISOString(),
      category: ticket.category,
      channel: 'EMAIL', // Hardcoded as we only process EMAIL channel
      aiProcessed: ticket.aiProcessed,
      aiClassification: ticket.aiClassification,
    }));

    return NextResponse.json({
      success: true,
      count: dashboardTickets.length,
      tickets: dashboardTickets,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tickets';
    console.error('[API /tickets] Error:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        tickets: [],
      },
      { status: 500 }
    );
  }
}

/**
 * Map Prisma TicketPriority enum to dashboard format
 */
function mapPrismaPriority(priority: TicketPriority): 'High' | 'Medium' | 'Low' | 'Critical' {
  switch (priority) {
    case TicketPriority.CRITICAL:
      return 'Critical';
    case TicketPriority.HIGH:
      return 'High';
    case TicketPriority.LOW:
      return 'Low';
    case TicketPriority.MEDIUM:
    default:
      return 'Medium';
  }
}

/**
 * Map Prisma TicketStatus enum to dashboard format
 */
function mapPrismaStatus(status: TicketStatus): string {
  switch (status) {
    case TicketStatus.OPEN:
      return 'Open';
    case TicketStatus.IN_PROGRESS:
      return 'In Progress';
    case TicketStatus.PENDING:
      return 'Pending';
    case TicketStatus.RESOLVED:
      return 'Resolved';
    case TicketStatus.CLOSED:
      return 'Closed';
    case TicketStatus.ESCALATED:
      return 'Escalated';
    default:
      return 'Open';
  }
}
