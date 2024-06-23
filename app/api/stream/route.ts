import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContentStream } from "@/app/helpers/generateLlmContentStream";
import { Subscription } from 'rxjs';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const numberParam = searchParams.get('number');
    const targetNumber = parseInt(numberParam || '', 10);

    if (isNaN(targetNumber)) {
        return NextResponse.json({ error: 'Invalid number' }, { status: 400 });
    }

    console.log('Generating stream...');

    const contents = [{
        role: 'user', parts: [{
            text: `
        Give me a list of ${targetNumber} things things you can do on the weekend.
        For each thing provide
         - a title
         - a description of at least 20 words (surround with double quotes, don't put new line chartacter!)
         - estimated duration
         - estimated cost
        Return the list in YAML format
        `
        }]
    }];

    const geminiStream$ = await generateLlmContentStream(contents);
    console.log('Generated stream...');
    const readableStream = new ReadableStream({
        start(controller) {
            let subscription: Subscription | undefined = undefined;
            subscription = geminiStream$.subscribe({
                next: (item) => {
                    if (Array.isArray(item)) {
                        item.forEach((i) => controller.enqueue(`data: ${JSON.stringify(i)}\n\n`));
                    } else {
                        controller.enqueue(`data: ${JSON.stringify(item)}\n\n`);
                    }
                },
                error: (err) => {
                    console.error('Error parsing YAML:', err);
                    controller.error(err);
                },
                complete: () => {
                    if (subscription) {
                        subscription.unsubscribe();
                        subscription = undefined;
                        controller.close();
                    }
                },
            });
        },
    });
    return new NextResponse(readableStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
