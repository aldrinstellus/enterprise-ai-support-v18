/**
 * Zoho to Supabase Sync Endpoint
 * Sync tickets from Zoho Desk to Supabase database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getZohoDeskClient } from '@/lib/integrations/zoho-desk';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const prisma = new PrismaClient();

interface ZohoTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string | null;
  email: string;
  contactId: string;
  createdTime: string;
  channel: string;
  category: string | null;
  departmentId: string;
}

interface ZohoTicketsResponse {
  data: ZohoTicket[];
  count: number;
}

/**
 * GET /api/zoho/sync
 * Sync tickets from Zoho Desk to Supabase
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const dryRun = searchParams.get('dryRun') === 'true';

  try {
    console.log(`[Zoho Sync] Starting sync (limit: ${limit}, dryRun: ${dryRun})...`);

    // Initialize Zoho client
    const zohoClient = getZohoDeskClient();

    // Fetch tickets from Zoho
    console.log('[Zoho Sync] Fetching tickets from Zoho Desk...');
    const zohoTickets = await zohoClient.request<ZohoTicketsResponse>(
      `/api/v1/tickets?limit=${limit}&sortBy=createdTime`
    );

    if (!zohoTickets.data || zohoTickets.data.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No tickets found in Zoho Desk',
        synced: 0,
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`[Zoho Sync] Found ${zohoTickets.data.length} tickets`);

    if (dryRun) {
      return NextResponse.json({
        success: true,
        message: 'Dry run - no data saved',
        tickets: zohoTickets.data.map(t => ({
          ticketNumber: t.ticketNumber,
          subject: t.subject,
          status: t.status,
          email: t.email,
        })),
        count: zohoTickets.data.length,
        timestamp: new Date().toISOString(),
      });
    }

    // Sync to Supabase
    const syncedTickets = [];
    const errors = [];

    for (const zohoTicket of zohoTickets.data) {
      try {
        // 1. Upsert customer
        const customer = await prisma.customer.upsert({
          where: { email: zohoTicket.email },
          update: {
            lastContact: new Date(zohoTicket.createdTime),
            updatedAt: new Date(),
          },
          create: {
            email: zohoTicket.email,
            name: zohoTicket.email.split('@')[0], // Extract name from email
            tier: 'STANDARD',
            lastContact: new Date(zohoTicket.createdTime),
          },
        });

        // 2. Upsert ticket
        const ticket = await prisma.ticket.upsert({
          where: { ticketNumber: zohoTicket.ticketNumber },
          update: {
            subject: zohoTicket.subject,
            status: mapZohoStatus(zohoTicket.status),
            priority: mapZohoPriority(zohoTicket.priority),
            zohoDeskId: zohoTicket.id,
            updatedAt: new Date(),
          },
          create: {
            ticketNumber: zohoTicket.ticketNumber,
            subject: zohoTicket.subject,
            description: zohoTicket.subject, // Will be updated with full description later
            status: mapZohoStatus(zohoTicket.status),
            priority: mapZohoPriority(zohoTicket.priority),
            customerId: customer.id,
            zohoDeskId: zohoTicket.id,
            category: zohoTicket.category || undefined,
            tags: [zohoTicket.channel],
            createdAt: new Date(zohoTicket.createdTime),
          },
        });

        syncedTickets.push({
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          status: ticket.status,
        });

        console.log(`[Zoho Sync] Synced ticket ${ticket.ticketNumber}`);

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Zoho Sync] Failed to sync ticket ${zohoTicket.ticketNumber}:`, errorMsg);
        errors.push({
          ticketNumber: zohoTicket.ticketNumber,
          error: errorMsg,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedTickets.length} tickets`,
      synced: syncedTickets,
      errors: errors.length > 0 ? errors : undefined,
      stats: {
        total: zohoTickets.data.length,
        synced: syncedTickets.length,
        failed: errors.length,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Zoho Sync] Sync failed:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Map Zoho status to Prisma TicketStatus enum
 */
function mapZohoStatus(zohoStatus: string): 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED' | 'ESCALATED' {
  const statusMap: Record<string, 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED' | 'ESCALATED'> = {
    'Open': 'OPEN',
    'On Hold': 'PENDING',
    'Escalated': 'ESCALATED',
    'Closed': 'CLOSED',
    'In Progress': 'IN_PROGRESS',
  };

  return statusMap[zohoStatus] || 'OPEN';
}

/**
 * Map Zoho priority to Prisma TicketPriority enum
 */
function mapZohoPriority(zohoPriority: string | null): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  if (!zohoPriority) return 'MEDIUM';

  const priorityMap: Record<string, 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'> = {
    'High': 'HIGH',
    'Medium': 'MEDIUM',
    'Low': 'LOW',
    'Critical': 'CRITICAL',
  };

  return priorityMap[zohoPriority] || 'MEDIUM';
}
