import type { DocumentPickerAsset } from 'expo-document-picker';
import { logRequestFailure } from '@/constants/api-errors';

type ToolOptions = Record<string, string>;

type RequestArgs = {
    endpoint: string;
    method?: 'POST';
    isNoFile: boolean;
    isMulti: boolean;
    files: DocumentPickerAsset[];
    options: ToolOptions;
};

function buildJsonInit(options: ToolOptions): RequestInit {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(options),
    };
}

function buildFormInit(args: {
    files: DocumentPickerAsset[];
    isMulti: boolean;
    options: ToolOptions;
}): RequestInit {
    const formData = new FormData();
    args.files.forEach((f) => {
        formData.append(args.isMulti ? 'files' : 'file', {
            uri: f.uri,
            name: f.name,
            type: f.mimeType ?? 'application/pdf',
        } as unknown as Blob);
    });
    Object.entries(args.options).forEach(([k, v]) => {
        if (v) formData.append(k, v);
    });
    return {
        method: 'POST',
        // Do NOT set Content-Type for multipart — RN sets boundary automatically.
        headers: { Accept: 'application/json' },
        body: formData,
    };
}

/**
 * Sends the tool request with automatic content-type fallback.
 *
 * Why: backends in the AMR7 stack are inconsistent about which content
 * types they accept. Some routes only accept JSON, others only multipart.
 * A 405/415 from one shape doesn't mean the tool is dead — it means the
 * server expected the other shape. We try the most likely shape first,
 * then fall back to the alternative on 405/415 only.
 *
 * - text-only tools: JSON → multipart fallback
 * - file tools:       multipart only (JSON cannot carry the binary safely)
 */
export async function executeToolRequest(args: RequestArgs): Promise<Response> {
    const attempts: { label: string; init: RequestInit }[] = [];

    if (args.isNoFile) {
        attempts.push({ label: 'json', init: buildJsonInit(args.options) });
        attempts.push({
            label: 'multipart',
            init: buildFormInit({ files: [], isMulti: false, options: args.options }),
        });
    } else {
        attempts.push({
            label: 'multipart',
            init: buildFormInit({ files: args.files, isMulti: args.isMulti, options: args.options }),
        });
    }

    let last: Response | null = null;
    for (let i = 0; i < attempts.length; i++) {
        const { label, init } = attempts[i];
        const res = await fetch(args.endpoint, init);
        last = res;
        if (res.status !== 405 && res.status !== 415) {
            return res;
        }
        logRequestFailure({
            endpoint: args.endpoint,
            method: `POST [${label}]`,
            status: res.status,
        });
    }
    // Both attempts returned 405/415; surface the last response so the caller
    // can render the branded "tool unavailable" view.
    return last as Response;
}
