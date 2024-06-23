import { Content, VertexAI } from "@google-cloud/vertexai";
import { Observable, catchError } from "rxjs";
import { extractTextFromLlmResponse } from "./extractTextFromLlmResponse";
import { splitByNewline } from "./splitByNewLine";
import { cleanupLlmResponse } from "./cleanupLlmResponse";
import { parseYamlItems } from "./parseYamlItems";
import { Item } from "./types";

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

export async function generateLlmContentStream(contents: Content[]): Promise<Observable<Item>> {
    const vertexAI = new VertexAI({
        project: process.env.GOOGLE_PROJECT_ID!,
        location: process.env.GOOGLE_PROJECT_REGION!,
        googleAuthOptions: {
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL!,
                private_key: process.env.GOOGLE_CLIENT_PRIVATE_KEY!,
            }
        }
        
    });

    const model = vertexAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL_ID!,
    });

    const request = {
        contents,
    };

    const response = await model.generateContentStream(request);
    return asyncGeneratorToObservable(response.stream)
        .pipe(extractTextFromLlmResponse())
        .pipe(splitByNewline())
        .pipe(cleanupLlmResponse())
        .pipe(parseYamlItems())
        // .pipe(tap(line => console.log('-----', line)))
        .pipe(catchError(err => {
            console.error('Error parsing YAML:', err);
            return [];
        }));
};