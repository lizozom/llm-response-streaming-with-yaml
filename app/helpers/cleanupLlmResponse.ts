import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function cleanupLlmResponse(): OperatorFunction<string, string> {
  return (source: Observable<string>) =>
    source.pipe(
      map(line => {
        return line.replace(/```/g, '').replace(/yaml/g, '')
      })
    );
}