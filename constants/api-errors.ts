export function arabicErrorForStatus(status: number, fallback?: string): string {
    if (status === 400) return 'البيانات المرسلة غير مكتملة. يرجى مراجعتها.';
    if (status === 401 || status === 403) return 'الوصول لهذه الخدمة غير مصرّح به حالياً.';
    if (status === 404) return 'هذه الخدمة غير متاحة حالياً.';
    if (status === 405) return 'هذه الأداة غير مفعّلة حالياً. سنقوم بتحديثها قريباً.';
    if (status === 413) return 'حجم الملف كبير جداً، الحد الأقصى 20 ميجابايت.';
    if (status === 415) return 'نوع الملف غير مدعوم في هذه الأداة.';
    if (status === 422) return 'تعذّر فهم البيانات المرسلة. تأكد من الحقول.';
    if (status === 429) return 'تم تجاوز عدد المحاولات. جرّب بعد دقائق.';
    if (status >= 500) return 'الخادم مشغول حالياً، يرجى المحاولة لاحقاً.';
    return fallback ?? 'تعذّر إتمام العملية. يرجى المحاولة مجدداً.';
}

export function arabicErrorForException(error: unknown): string {
    const message = error instanceof Error ? error.message : '';
    if (!message) return 'تعذّر إتمام العملية. يرجى المحاولة مجدداً.';
    if (/Network request failed|Network|TypeError: Network/i.test(message)) {
        return 'تحقق من اتصالك بالإنترنت ثم حاول مرة أخرى.';
    }
    if (/timeout/i.test(message)) {
        return 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.';
    }
    return message;
}

export function logRequestFailure(meta: { endpoint: string; method: string; status?: number; body?: unknown }) {
    if (!__DEV__) return;
    // eslint-disable-next-line no-console
    console.warn(
        `[amr7] request failed ${meta.method} ${meta.endpoint}` +
        (meta.status !== undefined ? ` → ${meta.status}` : ''),
        meta.body ?? '',
    );
}
