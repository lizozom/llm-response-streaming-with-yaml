import { Observable, catchError, tap } from "rxjs";
import { splitByNewline } from "./splitByNewLine";
import { cleanupResponse } from "./cleanupResponse";
import { parseYamlItems } from "./parseYamlItems";
import { Item } from "./types";

export function parseLlmResponse(yamlChunks$: Observable<string>): Observable<Item> {
    return yamlChunks$
        .pipe(splitByNewline())
        .pipe(cleanupResponse())
        .pipe(parseYamlItems())
        // .pipe(tap(line => console.log('-----', line)))
        .pipe(catchError(err => {
            console.error('Error parsing YAML:', err);
            return [];
        }))
}