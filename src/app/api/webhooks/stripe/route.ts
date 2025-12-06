
import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) { 
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get('workflowId');

    if (!workflowId) { 
      return NextResponse.json( 
        { success: false, error: "Failure: Missing required query parameter: workflowId" },
        { status: 400 },
      );
    };

    const body = await request.json();

    const stripeData = { 
      // Event metadata
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    // Trigger the respective Inngest job
    await sendWorkflowExecution({ 
      workflowId,
      initialData: { 
        stripe: stripeData,
      },
    });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json( 
      { success: false, error: "Failure: Failed to process Stripe event" },
      { status: 500 },
    );
  }
};
