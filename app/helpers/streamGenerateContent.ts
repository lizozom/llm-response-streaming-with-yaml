import { VertexAI } from "@google-cloud/vertexai";
import { Observable } from "rxjs";
import { extractTextFromResponse } from "./extractTextFromResponse";

function asyncGeneratorToObservable<T>(gen: AsyncGenerator<T>): Observable<T> {
    return new Observable<T>(observer => {
        (async () => {
            try {
                for await (let value of gen) {
                    observer.next(value);
                }
                observer.complete();
            } catch (err) {
                observer.error(err);
            }
        })();
    });
}

export async function streamGenerateContent(count: number): Promise<Observable<string>> {
    const vertexAI = new VertexAI({
        project: process.env.GOOGLE_PROJECT_ID!,
        location: process.env.GOOGLE_PROJECT_REGION!
    });

    const model = vertexAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL_ID!,
    });

    const request = {
        contents: [{
            role: 'user', parts: [{
                text: `
            Give me a list of ${count} things things you can do on the weekend.
            For each thing provide
             - a title
             - a description of at least 20 words (surround with double quotes, don't put new line chartacter!)
             - estimated duration
             - estimated cost
            Return the list in YAML format
            `
            }]
        }],
    };

    const response = await model.generateContentStream(request);
    return asyncGeneratorToObservable(response.stream)
        .pipe(extractTextFromResponse());
};