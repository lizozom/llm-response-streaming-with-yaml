import { Observable, OperatorFunction } from "rxjs";

export function splitByNewline(): OperatorFunction<string, string> {
    return (source: Observable<string>) => new Observable<string>(observer => {
      let buffer = '';
  
      return source.subscribe({
        next(chunk) {
          buffer += chunk;
          let parts = buffer.split('\n');
          buffer = parts.pop()!;
  
          parts.forEach(part => observer.next(part));
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          if (buffer.length > 0) {
            observer.next(buffer);
          }
          observer.complete();
        }
      });
    });
  }