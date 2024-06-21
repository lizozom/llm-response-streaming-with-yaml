import { Observable, OperatorFunction, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import YAML from 'yaml';
import { Item } from './types';

export function parseYamlItems(): OperatorFunction<string, Item> {
  return (source: Observable<string>) => {
    const lineAccumulator = new Subject<string>();

    const items$ = new Observable<string>(observer => {
      let buffer: string[] = [];

      lineAccumulator.subscribe({
        next: line => {
          if (line.trim().startsWith('- ')) {
            if (buffer.length > 0) {
              observer.next(buffer.join('\n'));
            }
            buffer = [line];
          } else if (line.length > 0) {
            buffer.push(line);
          }
        },
        error: err => observer.error(err),
        complete: () => {
          if (buffer.length > 0) {
            observer.next(buffer.join('\n'));
          }
          observer.complete();
        }
      });

      source.subscribe(line => lineAccumulator.next(line), err => observer.error(err), () => lineAccumulator.complete());
    });

    return items$
    .pipe(
      map(itemString => {
        try {
          const item = YAML.parse(itemString);
          return item;
        } catch (e) {
          console.error('Error parsing YAML:', e);
          return null;
        }
      }),
    );
  };
}

