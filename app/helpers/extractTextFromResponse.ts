import { GenerateContentResponse } from '@google-cloud/vertexai';
import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function extractTextFromResponse(): OperatorFunction<GenerateContentResponse, string> {
    return (source: Observable<GenerateContentResponse>) =>
        source.pipe(
            map(response => {
                if (
                    response.candidates &&
                    response.candidates[0] &&
                    response.candidates[0].content &&
                    response.candidates[0].content.parts &&
                    response.candidates[0].content.parts[0]
                ) {
                    return response.candidates[0].content.parts[0].text || '';
                } else {
                    throw new Error('Invalid response structure');
                }
            })
        );
}