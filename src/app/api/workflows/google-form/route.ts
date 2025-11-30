
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

    const formData = { 
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timeStamp: body.timeStamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    // Trigger the respective Inngest job
    await sendWorkflowExecution({ 
      workflowId,
      initialData: { 
        googleForm: formData,
      },
    });
  } catch (error) {
    console.error('Google form webhook error:', error);
    return NextResponse.json( 
      { success: false, error: "Failure: Google Form submission NOT processed" },
      { status: 500 },
    );
  }
};
