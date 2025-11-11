/**
 * Zoho Ticket Processing Pipeline
 * Main orchestration logic for AI-powered ticket handling
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';
import { getZohoDeskClient } from '@/lib/integrations/zoho-desk';
import { smartKBSearch } from '@/lib/integrations/dify';
import { getJiraClient } from '@/lib/integrations/jira';
import { aggregateConversation, detectEscalationSignals, consolidateForAI } from '@/lib/conversation-aggregator';
import { cleanEmailContent } from '@/lib/email-cleaner';
import { getPasswordResetTemplate, getAgentAssignmentTemplate, isPasswordResetIntent } from '@/lib/response-templates';
import { getAvailableAgent, assignTicketToAgent, logAgentAssignment } from '@/lib/agent-assignment';
import { detectWorkflowScenario, processWorkflowScenario, updateTicketWithWorkflowData } from '@/lib/workflow-engine';
import type { TicketProcessingResult, TicketClassification, ProcessingStep } from '@/types/ticket';
import type { ZohoEventType, ZohoTicketPayload } from '@/types/zoho';
import { TICKET_CATEGORIES } from '@/types/ticket';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Maximum execution time

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/zoho/process-ticket
 * Process a Zoho ticket with AI classification, KB search, and response generation
 */
export async function POST(req: NextRequest) {
  const startTime = new Date().toISOString();
  const timeline: ProcessingStep[] = [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ticketId, eventType, payload, headers } = await req.json() as {
      ticketId: string;
      eventType: ZohoEventType;
      payload: ZohoTicketPayload;
      headers: { host: string };
    };

    console.log(`[Processing] Starting ticket ${ticketId}`);

    // Initialize clients
    const zohoClient = getZohoDeskClient();
    const jiraClient = getJiraClient();

    // Step 1: Extract ticket information
    timeline.push({
      step: 'extract_info',
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    });

    const isThread = eventType === 'Ticket_Thread_Add';

    // For thread events, we need to fetch the ticket details to get ticketNumber and subject
    let ticketDetails: { ticketNumber: string; subject: string; contact?: { lastName?: string; firstName?: string } } | null = null;
    if (isThread && !payload.ticketNumber) {
      try {
        const details = await zohoClient.getTicket(ticketId);
        ticketDetails = details as { ticketNumber: string; subject: string; contact?: { lastName?: string; firstName?: string } };
        console.log(`[Processing] Fetched ticket details for thread: ticketNumber=${ticketDetails.ticketNumber}, subject="${ticketDetails.subject}"`);
      } catch (error) {
        console.error('[Processing] Failed to fetch ticket details:', error);
      }
    }

    const extractedInfo = {
      ticket_id: ticketId,
      subject: payload.subject || ticketDetails?.subject || '',
      original_query: cleanEmailContent(
        isThread ? payload.content || '' : payload.firstThread?.content || ''
      ),
      customer_email: isThread ? payload.author?.email || '' : payload.email || payload.contact?.email || '',
      vendor_email: isThread ? payload.to || '' : payload.firstThread?.to || '',
      channel: payload.channel,
      ticketNumber: payload.ticketNumber || ticketDetails?.ticketNumber || '',
    };

    timeline[timeline.length - 1].status = 'completed';
    timeline[timeline.length - 1].duration = 50;

    // Step 2: Get conversations
    timeline.push({
      step: 'get_conversations',
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    });

    const conversations = await zohoClient.getConversations(ticketId);

    // Extract thread messages
    const threads = conversations.data
      .filter(conv => conv.type === 'thread')
      .map(conv => ({
        id: conv.id,
        content: conv.content || '',
        authorType: conv.author.type,
        createdTime: conv.createdTime,
        channel: conv.channel,
      }));

    console.log(`[Processing] Retrieved ${threads.length} threads from conversations`);
    console.log(`[Processing] Thread summary:`, threads.map(t => ({
      authorType: t.authorType,
      contentPreview: t.content.substring(0, 100)
    })));

    timeline[timeline.length - 1].status = 'completed';
    timeline[timeline.length - 1].duration = 200;

    // Step 3: Aggregate conversation
    const aggregated = aggregateConversation(threads);
    const optimizedQuery = consolidateForAI(aggregated, {
      maxLength: 200,
      focusOnTechnical: true,
    });

    console.log(`[Processing] Optimized query: ${optimizedQuery}`);

    // Step 3.5: Check for password reset intent
    const isPasswordReset = isPasswordResetIntent(extractedInfo.subject, extractedInfo.original_query);

    if (isPasswordReset && !isThread) {
      // Initial password reset request - send template response
      timeline.push({
        step: 'send_password_reset_template',
        status: 'in_progress',
        timestamp: new Date().toISOString(),
      });

      const customerName = payload.contact?.lastName || payload.contact?.firstName;
      const passwordResetResponse = getPasswordResetTemplate(customerName);

      const replyPayload = {
        contentType: 'html' as const,
        content: passwordResetResponse.htmlContent,
        fromEmailAddress: 'support@atcaisupport.zohodesk.com',
        to: extractedInfo.customer_email,
        isForward: false,
        channel: 'EMAIL' as const,
      };

      console.log('[Processing] Sending password reset template');

      const replyResponse = await zohoClient.sendReply(ticketId, replyPayload);

      timeline[timeline.length - 1].status = 'completed';
      timeline[timeline.length - 1].duration = 500;

      // Save to database
      timeline.push({
        step: 'save_to_database',
        status: 'in_progress',
        timestamp: new Date().toISOString(),
      });

      try {
        const customer = await prisma.customer.upsert({
          where: { email: extractedInfo.customer_email },
          update: {
            lastContact: new Date(),
            updatedAt: new Date()
          },
          create: {
            email: extractedInfo.customer_email,
            name: customerName || extractedInfo.customer_email.split('@')[0],
            tier: 'STANDARD',
            lastContact: new Date(),
          },
        });

        const priorityMap: Record<string, 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'> = {
          'High': 'HIGH',
          'Medium': 'MEDIUM',
          'Low': 'LOW',
          'Critical': 'CRITICAL',
        };
        const mappedPriority = priorityMap[payload.priority] || 'MEDIUM';

        await prisma.ticket.upsert({
          where: { ticketNumber: payload.ticketNumber },
          update: {
            aiProcessed: true,
            aiClassification: 'SIMPLE_RESPONSE',
            aiResponse: passwordResetResponse.plainTextFallback,
            aiConfidence: 0.95,
            status: 'OPEN',
            updatedAt: new Date(),
          },
          create: {
            ticketNumber: payload.ticketNumber,
            subject: extractedInfo.subject,
            description: extractedInfo.original_query,
            status: 'OPEN',
            priority: mappedPriority,
            customerId: customer.id,
            zohoDeskId: ticketId,
            aiProcessed: true,
            aiClassification: 'SIMPLE_RESPONSE',
            aiResponse: passwordResetResponse.plainTextFallback,
            aiConfidence: 0.95,
          },
        });

        console.log(`[Processing] Saved password reset ticket ${payload.ticketNumber} to database`);

        timeline[timeline.length - 1].status = 'completed';
        timeline[timeline.length - 1].duration = 300;
      } catch (dbError) {
        console.error('[Processing] Database save error:', dbError);
        timeline[timeline.length - 1].status = 'failed';
        timeline[timeline.length - 1].duration = 100;
      }

      const result: TicketProcessingResult = {
        ticketId,
        ticketNumber: payload.ticketNumber,
        status: 'completed',
        classification: {
          primary_category: 'SIMPLE_RESPONSE',
          secondary_categories: [],
          confidence: 0.95,
          reasoning: 'Password reset request detected',
          required_info: [],
          estimated_complexity: 'low',
          auto_resolvable: true,
        },
        aiResponse: {
          text: passwordResetResponse.plainTextFallback,
          confidence: 0.95,
          needsEscalation: false,
          escalationSignals: [],
        },
        zohoReply: {
          id: replyResponse.id,
          sent: true,
          timestamp: replyResponse.createdTime,
        },
        timeline,
        startTime,
        endTime: new Date().toISOString(),
        totalDuration: Date.now() - new Date(startTime).getTime(),
      };

      console.log(`[Processing] Completed password reset ticket ${ticketId} in ${result.totalDuration}ms`);

      return NextResponse.json(result);
    }

    // Step 3.6: DEMO - Simple follow-up detection for password reset tickets
    console.log(`[Processing] Follow-up check: isThread=${isThread}, subject="${extractedInfo.subject}"`);

    // For demo: If it's a follow-up (thread) on a password-related ticket, assign to agent
    const isPasswordRelatedThread = isThread && isPasswordResetIntent(extractedInfo.subject, extractedInfo.original_query);

    if (isPasswordRelatedThread) {
      console.log(`[Processing] DEMO: Password-related follow-up detected - assigning to agent`);

      // Simple escalation for demo
      const demoEscalation = {
        needsHumanEscalation: true,
        reason: 'Follow-up on password reset issue - demo escalation',
        signals: ['follow-up detected'],
      };

      if (demoEscalation.needsHumanEscalation) {
        console.log(`[Processing] Follow-up detected: ${demoEscalation.reason}`);

        // Assign to human agent
        timeline.push({
          step: 'assign_to_human_agent',
          status: 'in_progress',
          timestamp: new Date().toISOString(),
        });

        const availableAgent = await getAvailableAgent();

        if (availableAgent) {
          const assigned = await assignTicketToAgent(extractedInfo.ticketNumber, availableAgent.id);

          if (assigned) {
            // Log the assignment
            const ticket = await prisma.ticket.findUnique({
              where: { ticketNumber: extractedInfo.ticketNumber },
            });

            if (ticket) {
              await logAgentAssignment(ticket.id, availableAgent.id, demoEscalation.reason);
            }

            // Send agent assignment notification
            const customerName = payload.contact?.lastName || payload.contact?.firstName || ticketDetails?.contact?.lastName;
            const agentNotification = getAgentAssignmentTemplate(
              customerName,
              availableAgent.name,
              extractedInfo.ticketNumber
            );

            const replyPayload = {
              contentType: 'html' as const,
              content: agentNotification.htmlContent,
              fromEmailAddress: 'support@atcaisupport.zohodesk.com',
              to: extractedInfo.customer_email,
              isForward: false,
              channel: 'EMAIL' as const,
            };

            console.log(`[Processing] Sending agent assignment notification for ${availableAgent.name}`);

            const replyResponse = await zohoClient.sendReply(ticketId, replyPayload);

            timeline[timeline.length - 1].status = 'completed';
            timeline[timeline.length - 1].duration = 800;

            // Update database with assignment
            timeline.push({
              step: 'update_database_assignment',
              status: 'in_progress',
              timestamp: new Date().toISOString(),
            });

            try {
              await prisma.ticket.update({
                where: { ticketNumber: extractedInfo.ticketNumber },
                data: {
                  status: 'IN_PROGRESS',
                  assigneeId: availableAgent.id,
                  updatedAt: new Date(),
                },
              });

              console.log(`[Processing] Updated ticket ${extractedInfo.ticketNumber} with agent assignment`);

              timeline[timeline.length - 1].status = 'completed';
              timeline[timeline.length - 1].duration = 200;
            } catch (dbError) {
              console.error('[Processing] Database update error:', dbError);
              timeline[timeline.length - 1].status = 'failed';
              timeline[timeline.length - 1].duration = 100;
            }

            const result: TicketProcessingResult = {
              ticketId,
              ticketNumber: extractedInfo.ticketNumber,
              status: 'completed',
              classification: {
                primary_category: 'ESCALATION_NEEDED',
                secondary_categories: [],
                confidence: 0.95,
                reasoning: demoEscalation.reason,
                required_info: [],
                estimated_complexity: 'high',
                auto_resolvable: false,
              },
              aiResponse: {
                text: agentNotification.plainTextFallback,
                confidence: 0.95,
                needsEscalation: true,
                escalationSignals: demoEscalation.signals,
              },
              zohoReply: {
                id: replyResponse.id,
                sent: true,
                timestamp: replyResponse.createdTime,
              },
              timeline,
              startTime,
              endTime: new Date().toISOString(),
              totalDuration: Date.now() - new Date(startTime).getTime(),
            };

            console.log(`[Processing] Completed agent assignment for ticket ${ticketId} in ${result.totalDuration}ms`);

            return NextResponse.json(result);
          }
        } else {
          console.warn('[Processing] No available agents for assignment');
        }
      }
    }

    // ========================================
    // Step 3.7: NEW MULTI-SCENARIO WORKFLOW ENGINE
    // ========================================
    // This runs ONLY if NOT password reset
    // Handles: account unlock, access request, general support, email notifications, printer issues, course completion
    console.log('[Processing] Checking for workflow scenarios (non-password)...');

    if (!isPasswordReset && !isPasswordRelatedThread) {
      try {
        const workflowContext = {
          ticketId,
          ticketNumber: extractedInfo.ticketNumber,
          subject: extractedInfo.subject,
          content: extractedInfo.original_query,
          customerEmail: extractedInfo.customer_email,
          customerName: payload.contact?.lastName || payload.contact?.firstName,
          isThread,
        };

        const detectedScenario = detectWorkflowScenario(workflowContext);

        if (detectedScenario) {
          console.log(`[Processing] ✅ Detected workflow scenario: ${detectedScenario}`);

          timeline.push({
            step: `process_${detectedScenario}_workflow`,
            status: 'in_progress',
            timestamp: new Date().toISOString(),
          });

          const workflowResult = await processWorkflowScenario(detectedScenario, workflowContext);

          if (workflowResult && workflowResult.handled) {
            console.log(`[Processing] Workflow handled: aiResolved=${workflowResult.aiResolved}, requiresHuman=${workflowResult.requiresHuman}`);

            timeline[timeline.length - 1].status = 'completed';
            timeline[timeline.length - 1].duration = 1000;

            // Send email response
            if (workflowResult.response) {
              timeline.push({
                step: 'send_workflow_response',
                status: 'in_progress',
                timestamp: new Date().toISOString(),
              });

              const replyPayload = {
                contentType: 'html' as const,
                content: workflowResult.response.htmlContent,
                fromEmailAddress: 'support@atcaisupport.zohodesk.com',
                to: extractedInfo.customer_email,
                isForward: false,
                channel: 'EMAIL' as const,
              };

              const replyResponse = await zohoClient.sendReply(ticketId, replyPayload);

              timeline[timeline.length - 1].status = 'completed';
              timeline[timeline.length - 1].duration = 500;

              // Update database with workflow metadata
              timeline.push({
                step: 'update_database_workflow',
                status: 'in_progress',
                timestamp: new Date().toISOString(),
              });

              try {
                await updateTicketWithWorkflowData(
                  extractedInfo.ticketNumber,
                  detectedScenario,
                  workflowResult.aiResolved,
                  workflowResult.systemActions,
                  workflowResult.verificationResults
                );

                timeline[timeline.length - 1].status = 'completed';
                timeline[timeline.length - 1].duration = 200;
              } catch (dbError) {
                console.error('[Processing] Workflow database update error:', dbError);
                timeline[timeline.length - 1].status = 'failed';
                timeline[timeline.length - 1].duration = 100;
              }

              // Return workflow result
              const result: TicketProcessingResult = {
                ticketId,
                ticketNumber: extractedInfo.ticketNumber,
                status: 'completed',
                classification: {
                  primary_category: workflowResult.aiResolved ? 'SIMPLE_RESPONSE' : 'ESCALATION_NEEDED',
                  secondary_categories: [],
                  confidence: 0.95,
                  reasoning: `Workflow scenario: ${detectedScenario}`,
                  required_info: [],
                  estimated_complexity: workflowResult.requiresHuman ? 'high' : 'low',
                  auto_resolvable: workflowResult.aiResolved,
                },
                aiResponse: {
                  text: workflowResult.response.plainTextFallback,
                  confidence: 0.95,
                  needsEscalation: workflowResult.requiresHuman,
                  escalationSignals: workflowResult.requiresHuman ? ['workflow_escalation'] : [],
                },
                zohoReply: {
                  id: replyResponse.id,
                  sent: true,
                  timestamp: replyResponse.createdTime,
                },
                timeline,
                startTime,
                endTime: new Date().toISOString(),
                totalDuration: Date.now() - new Date(startTime).getTime(),
              };

              console.log(`[Processing] ✅ Completed ${detectedScenario} workflow in ${result.totalDuration}ms`);

              return NextResponse.json(result);
            }
          } else {
            console.log('[Processing] Workflow not handled, falling back to Claude AI');
            timeline[timeline.length - 1].status = 'completed';
            timeline[timeline.length - 1].duration = 100;
          }
        } else {
          console.log('[Processing] No workflow scenario detected, proceeding to Claude AI');
        }
      } catch (workflowError) {
        console.error('[Processing] Workflow engine error (falling back to Claude AI):', workflowError);
        // Graceful fallback - continue to Claude AI processing
      }
    }

    // Step 4: Classify ticket
    timeline.push({
      step: 'classify_ticket',
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    });

    const classification = await classifyTicket({
      subject: extractedInfo.subject,
      conversation: payload.firstThread?.content || extractedInfo.original_query,
      priority: payload.priority,
      category: payload.category || '',
      customer: payload.contact?.lastName || '',
      ticketNumber: payload.ticketNumber,
      status: payload.status,
    });

    timeline[timeline.length - 1].status = 'completed';
    timeline[timeline.length - 1].duration = 1500;

    console.log(`[Processing] Classification: ${classification.primary_category} (${classification.confidence})`);

    // Step 5: Route based on classification
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const categoryConfig = TICKET_CATEGORIES[classification.primary_category];

    if (classification.primary_category === 'DATA_GENERATION') {
      // Direct to Jira for report requests (if Jira is configured)
      timeline.push({
        step: 'create_jira_report',
        status: 'in_progress',
        timestamp: new Date().toISOString(),
      });

      let jiraTicket = undefined;

      if (jiraClient) {
        jiraTicket = await jiraClient.createZohoEscalation({
          title: `[REPORT] - ${extractedInfo.subject}`,
          description: `Customer: ${payload.contact?.lastName || 'Unknown'} (${extractedInfo.customer_email})\n\nRequest:\n${extractedInfo.original_query}`,
          zohoTicketId: ticketId,
          zohoTicketUrl: payload.webUrl,
          priority: payload.priority === 'High' ? 'High' : 'Medium',
          customer: `${payload.contact?.lastName} (${extractedInfo.customer_email})`,
        });
      } else {
        console.warn('[Processing] Jira not configured - skipping Jira ticket creation');
      }

      timeline[timeline.length - 1].status = 'completed';
      timeline[timeline.length - 1].duration = 800;

      const result: TicketProcessingResult = {
        ticketId,
        ticketNumber: payload.ticketNumber,
        status: 'completed',
        classification,
        jiraTicket: jiraTicket ? {
          key: jiraTicket.key,
          id: jiraTicket.id,
          url: jiraTicket.self,
          summary: `[REPORT] - ${extractedInfo.subject}`,
          created: new Date().toISOString(),
        } : undefined,
        timeline,
        startTime,
        endTime: new Date().toISOString(),
        totalDuration: Date.now() - new Date(startTime).getTime(),
      };

      return NextResponse.json(result);
    }

    // Step 6: Knowledge base search (for non-DATA_GENERATION tickets)
    timeline.push({
      step: 'kb_search',
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    });

    const kbResult = await smartKBSearch(optimizedQuery);

    timeline[timeline.length - 1].status = 'completed';
    timeline[timeline.length - 1].duration = 1200;

    // Step 7: Generate AI response
    timeline.push({
      step: 'generate_response',
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    });

    const aiResponse = await generateResponse({
      query: optimizedQuery,
      context: kbResult.answer || kbResult.context || '',
    });

    timeline[timeline.length - 1].status = 'completed';
    timeline[timeline.length - 1].duration = 2500;

    // Step 8: Send reply to Zoho
    timeline.push({
      step: 'send_reply',
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    });

    const replyPayload = {
      contentType: 'plainText' as const,
      content: aiResponse.text,
      fromEmailAddress: 'support@atcaisupport.zohodesk.com',
      to: extractedInfo.customer_email,
      isForward: false,
      channel: 'EMAIL' as const,
    };

    console.log('[Processing] Sending reply to Zoho:', { ticketId, from: replyPayload.fromEmailAddress, to: replyPayload.to, contentLength: replyPayload.content.length });

    const replyResponse = await zohoClient.sendReply(ticketId, replyPayload);

    timeline[timeline.length - 1].status = 'completed';
    timeline[timeline.length - 1].duration = 500;

    // Step 9: Save to database
    timeline.push({
      step: 'save_to_database',
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    });

    try {
      // Upsert customer
      const customer = await prisma.customer.upsert({
        where: { email: extractedInfo.customer_email },
        update: {
          lastContact: new Date(),
          updatedAt: new Date()
        },
        create: {
          email: extractedInfo.customer_email,
          name: payload.contact?.lastName || extractedInfo.customer_email.split('@')[0],
          tier: 'STANDARD',
          lastContact: new Date(),
        },
      });

      // Map Zoho priority to Prisma enum
      const priorityMap: Record<string, 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'> = {
        'High': 'HIGH',
        'Medium': 'MEDIUM',
        'Low': 'LOW',
        'Critical': 'CRITICAL',
      };
      const mappedPriority = priorityMap[payload.priority] || 'MEDIUM';

      // Upsert ticket with AI data
      await prisma.ticket.upsert({
        where: { ticketNumber: extractedInfo.ticketNumber },
        update: {
          aiProcessed: true,
          aiClassification: classification.primary_category,
          aiResponse: aiResponse.text,
          aiConfidence: classification.confidence,
          status: 'OPEN',
          updatedAt: new Date(),
        },
        create: {
          ticketNumber: extractedInfo.ticketNumber,
          subject: extractedInfo.subject,
          description: extractedInfo.original_query,
          status: 'OPEN',
          priority: mappedPriority,
          customerId: customer.id,
          zohoDeskId: ticketId,
          category: payload.category,
          aiProcessed: true,
          aiClassification: classification.primary_category,
          aiResponse: aiResponse.text,
          aiConfidence: classification.confidence,
        },
      });

      console.log(`[Processing] Saved ticket ${extractedInfo.ticketNumber} to database`);

      timeline[timeline.length - 1].status = 'completed';
      timeline[timeline.length - 1].duration = 300;
    } catch (dbError) {
      console.error('[Processing] Database save error:', dbError);
      timeline[timeline.length - 1].status = 'failed';
      timeline[timeline.length - 1].duration = 100;
      // Continue processing even if DB save fails
    }

    // Step 10: Check if Jira escalation needed
    timeline.push({
      step: 'check_escalation',
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    });

    const escalation = detectEscalationSignals(aiResponse.text);
    let jiraTicket = undefined;

    if (escalation.hasSignals || !classification.auto_resolvable) {
      timeline.push({
        step: 'create_jira_escalation',
        status: 'in_progress',
        timestamp: new Date().toISOString(),
      });

      if (jiraClient) {
        const createdJira = await jiraClient.createZohoEscalation({
          title: extractedInfo.subject,
          description: `User Query: ${optimizedQuery}\n\nAgent Response: ${aiResponse.text}`,
          zohoTicketId: ticketId,
          zohoTicketUrl: payload.webUrl,
          priority: payload.priority === 'High' ? 'High' : 'Medium',
          customer: `${payload.contact?.lastName} (${extractedInfo.customer_email})`,
        });

        jiraTicket = {
          key: createdJira.key,
          id: createdJira.id,
          url: createdJira.self,
          summary: extractedInfo.subject,
          created: new Date().toISOString(),
        };
      } else {
        console.warn('[Processing] Jira not configured - skipping escalation ticket creation');
      }

      timeline[timeline.length - 1].status = 'completed';
      timeline[timeline.length - 1].duration = 800;
    }

    timeline[timeline.length - 2].status = 'completed';
    timeline[timeline.length - 2].duration = 100;

    // Build final result
    const result: TicketProcessingResult = {
      ticketId,
      ticketNumber: payload.ticketNumber,
      status: 'completed',
      classification,
      kbSearch: {
        query: optimizedQuery,
        method: kbResult.method,
        matches: kbResult.matches,
      },
      aiResponse: {
        text: aiResponse.text,
        confidence: 0.85,
        needsEscalation: escalation.hasSignals,
        escalationSignals: escalation.signals,
      },
      zohoReply: {
        id: replyResponse.id,
        sent: true,
        timestamp: replyResponse.createdTime,
      },
      jiraTicket,
      timeline,
      startTime,
      endTime: new Date().toISOString(),
      totalDuration: Date.now() - new Date(startTime).getTime(),
    };

    console.log(`[Processing] Completed ticket ${ticketId} in ${result.totalDuration}ms`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Processing] Error:', error);

    const errorResult: TicketProcessingResult = {
      ticketId: '',
      ticketNumber: '',
      status: 'failed',
      classification: {
        primary_category: 'ESCALATION_NEEDED',
        secondary_categories: [],
        confidence: 0,
        reasoning: 'Processing failed',
        required_info: [],
        estimated_complexity: 'high',
        auto_resolvable: false,
      },
      timeline,
      startTime,
      endTime: new Date().toISOString(),
      error: {
        step: timeline[timeline.length - 1]?.step || 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
    };

    return NextResponse.json(errorResult, { status: 500 });
  }
}

/**
 * Classify ticket using Claude
 */
async function classifyTicket(input: {
  subject: string;
  conversation: string;
  priority: string;
  category: string;
  customer: string;
  ticketNumber: string;
  status: string;
}): Promise<TicketClassification> {
  const prompt = `You are a support ticket classifier for an e-learning platform. Analyze this ticket and classify it.

**Subject**: ${input.subject}
**Conversation**: ${input.conversation}
**Priority**: ${input.priority}
**Current Category**: ${input.category}
**Customer**: ${input.customer}
**Ticket #**: ${input.ticketNumber}
**Status**: ${input.status}

**Categories**:
- DATA_GENERATION: Reports, analytics, data exports
- BACKEND_INVESTIGATION: System bugs, technical debugging
- MANUAL_ADMIN: User/account management
- CONTENT_MANAGEMENT: Course creation, content publishing
- CONFIGURATION: System settings, integrations
- SIMPLE_RESPONSE: How-to questions, information requests
- ESCALATION_NEEDED: Complex issues requiring human judgment

Return JSON:
{
  "primary_category": "CATEGORY_NAME",
  "secondary_categories": ["CATEGORY_NAME2"],
  "confidence": 0.95,
  "reasoning": "Brief explanation",
  "required_info": ["missing_info"],
  "estimated_complexity": "low|medium|high",
  "auto_resolvable": true|false
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: prompt,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const json = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

  return json || {
    primary_category: 'SIMPLE_RESPONSE',
    secondary_categories: [],
    confidence: 0.5,
    reasoning: 'Failed to parse classification',
    required_info: [],
    estimated_complexity: 'medium',
    auto_resolvable: false,
  };
}

/**
 * Generate AI response using Claude
 */
async function generateResponse(input: {
  query: string;
  context: string;
}): Promise<{ text: string }> {
  const prompt = `You are a support agent. Use the following context to answer the question. If you don't have enough details, let the user know you need to check with the team.

**Question**: ${input.query}
**Context**: ${input.context}

Provide a helpful, professional response.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: prompt,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  return { text };
}
