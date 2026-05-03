import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    I18nManager,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { arabicErrorForException, arabicErrorForStatus } from '@/constants/api-errors';
import { getToolById } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';

const RTL_ALIGN = I18nManager.isRTL ? 'right' : 'left';

// ─── ثوابت ───────────────────────────────────────────────
const API_BASE = 'https://pdf.amr7.io/api';
const WEB_BASE = 'https://pdf.amr7.io/tools';

const WEBVIEW_TOOLS = new Set([
    'sign-pdf', 'fill-pdf-form', 'edit-pdf-text', 'pdf-reader',
    'scan-document', 'redact-pdf', 'translate-pdf', 'compare-pdf',
    'pdf-to-excel', 'pdf-to-pptx', 'pdf-a', 'html-to-pdf',
    'ai-image-gen', 'qr-code', 'barcode', 'invoice',
    'whatsapp-link', 'email-signature', 'text-tools', 'calculators',
    'color-tools', 'image-tools', 'dev-tools', 'zakat', 'support',
]);

const WEB_SLUG: Record<string, string> = {
    'ai-chat':       'ai-chat-pdf',
    'ai-summarize':  'ai-summarizer',
    'ai-tables':     'ai-extract-tables',
    'ai-image-gen':  'ai-image-gen',
    'prompt-gen':    'prompt-generator',
    'prompt-check':  'prompt-checker',
    'header-footer': 'header-footer-pdf',
    'edit-metadata': 'edit-metadata',
    'pdf-to-pptx':   'pdf-to-pptx',
    'pdf-to-excel':  'pdf-to-excel',
    'html-to-pdf':   'html-to-pdf',
    'pdf-a':         'pdf-a',
    'sign-pdf':      'sign-pdf',
    'scan-document': 'scan-document',
    'fill-pdf-form': 'fill-pdf-form',
    'edit-pdf-text': 'edit-pdf-text',
    'pdf-reader':    'pdf-reader',
    'redact-pdf':    'redact-pdf',
    'translate-pdf': 'translate-pdf',
    'compare-pdf':   'compare-pdf',
};

const API_MAP: Record<string, string> = {
    merge:              'merge-pdf',
    split:              'split-pdf',
    compress:           'compress-pdf',
    rotate:             'rotate-pdf',
    'extract-pages':    'extract-pages',
    'delete-pages':     'delete-pages',
    organize:           'organize-pdf',
    crop:               'crop-pdf',
    resize:             'resize-pdf',
    'add-page-numbers': 'add-page-numbers',
    'header-footer':    'header-footer-pdf',
    watermark:          'watermark-pdf',
    protect:            'protect-pdf',
    unlock:             'unlock-pdf',
    'edit-metadata':    'edit-pdf-metadata',
    flatten:            'flatten-pdf',
    repair:             'repair-pdf',
    grayscale:          'grayscale-pdf',
    'extract-images':   'extract-images',
    ocr:                'ocr-pdf',
    'pdf-to-jpg':       'pdf-to-jpg',
    'jpg-to-pdf':       'jpg-to-pdf',
    'word-to-pdf':      'word-to-pdf',
    'excel-to-pdf':     'excel-to-pdf',
    'ai-chat':          'ai/chat-pdf',
    'ai-summarize':     'ai/summarize',
    'ai-tables':        'ai/extract-tables',
    'prompt-gen':       'ai/prompt-generator',
    'prompt-check':     'ai/prompt-checker',
    'ai-detector':      'ai/detector',
    humanizer:          'ai/humanizer',
};

const MULTI_FILE_TOOLS  = new Set(['merge', 'jpg-to-pdf']);
const TEXT_RESULT_TOOLS = new Set(['ocr', 'ai-chat', 'ai-summarize', 'ai-tables', 'prompt-gen', 'prompt-check', 'ai-detector', 'humanizer']);
const IMG_RESULT_TOOLS  = new Set(['pdf-to-jpg', 'extract-images']);
const WORD_TOOLS        = new Set(['word-to-pdf']);
const EXCEL_TOOLS       = new Set(['excel-to-pdf']);
const NO_FILE_TOOLS     = new Set(['prompt-gen', 'prompt-check', 'humanizer', 'ai-detector']);

type ToolOptions = Record<string, string>;

const TOOL_OPTIONS: Record<string, { label: string; key: string; placeholder: string; multiline?: boolean }[]> = {
    split:           [{ label: 'أرقام الصفحات', key: 'pages', placeholder: 'مثال: 1,3,5' }],
    'extract-pages': [{ label: 'الصفحات المطلوبة', key: 'pages', placeholder: 'مثال: 1-3' }],
    'delete-pages':  [{ label: 'الصفحات للحذف', key: 'pages', placeholder: 'مثال: 2,4' }],
    protect:         [{ label: 'كلمة المرور الجديدة', key: 'password', placeholder: 'كلمة المرور لحماية الملف' }],
    unlock:          [{ label: 'كلمة المرور الحالية', key: 'password', placeholder: 'أدخل كلمة المرور الحالية' }],
    watermark:       [{ label: 'نص العلامة المائية', key: 'text', placeholder: 'سري | نسخة تجريبية' }],
    'edit-metadata': [
        { label: 'عنوان الملف', key: 'title', placeholder: 'اسم المستند الجديد' },
        { label: 'اسم المؤلف', key: 'author', placeholder: 'اسم الكاتب أو الجهة' },
    ],
    'ai-chat':       [{ label: 'السؤال أو الطلب', key: 'question', placeholder: 'اطلب تلخيصاً، أو اسأل عن أي معلومة في الملف...', multiline: true }],
    'prompt-gen':    [{ label: 'الفكرة الأساسية', key: 'idea', placeholder: 'اشرح الفكرة لتحويلها إلى أمر احترافي...', multiline: true }],
    'prompt-check':  [{ label: 'الأمر الحالي', key: 'prompt', placeholder: 'ألصق الأمر هنا للتقييم والتحسين...', multiline: true }],
    humanizer:       [{ label: 'النص المولد آلياً', key: 'text', placeholder: 'ألصق النص لإعادة الصياغة...', multiline: true }],
    'ai-detector':   [{ label: 'النص المراد فحصه', key: 'text', placeholder: 'ألصق النص لمعرفة نسبة التوليد الآلي...', multiline: true }],
};

// ─── مكوّن WebView ────────────────────────────────────────
function ToolWebView({ toolId, toolName, onBack }: { toolId: string; toolName: string; onBack: () => void }) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const slug = WEB_SLUG[toolId] ?? toolId;
    const url  = `${WEB_BASE}/${slug}`;

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={[wvStyles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
                <TouchableOpacity style={wvStyles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons
                        name={I18nManager.isRTL ? 'chevron-forward' : 'chevron-back'}
                        size={22}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
                <Text style={wvStyles.title} numberOfLines={1}>{toolName}</Text>
                <View style={{ width: 38 }} />
            </View>

            {loading && (
                <View style={wvStyles.loadingBar}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Text style={wvStyles.loadingText}>جاري تهيئة مساحة العمل...</Text>
                </View>
            )}

            <WebView
                source={{ uri: url }}
                style={{ flex: 1 }}
                onLoadEnd={() => setLoading(false)}
                onError={() => setLoading(false)}
                javaScriptEnabled
                domStorageEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                startInLoadingState={false}
                userAgent={
                    Platform.OS === 'ios'
                        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
                        : 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Mobile Safari/537.36'
                }
            />
        </View>
    );
}

// ─── الشاشة الرئيسية ─────────────────────────────────────
export default function ToolScreen() {
    const { id }    = useLocalSearchParams<{ id: string }>();
    const insets    = useSafeAreaInsets();
    const tool      = getToolById(id);

    const [files,      setFiles]      = useState<DocumentPicker.DocumentPickerAsset[]>([]);
    const [loading,    setLoading]    = useState(false);
    const [done,       setDone]       = useState(false);
    const [resultUri,  setResultUri]  = useState<string | null>(null);
    const [textResult, setTextResult] = useState<string | null>(null);
    const [options,    setOptions]    = useState<ToolOptions>({});

    if (!tool) {
        return (
            <View style={styles.center}>
                <View style={styles.notFoundIcon}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={32} color={theme.colors.textMuted} />
                </View>
                <Text style={styles.notFoundText}>الأداة غير متوفرة حالياً</Text>
                <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
                    <Text style={styles.backLinkText}>العودة</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (WEBVIEW_TOOLS.has(id ?? '')) {
        return <ToolWebView toolId={id!} toolName={tool.name} onBack={() => router.back()} />;
    }

    const isMulti      = MULTI_FILE_TOOLS.has(id ?? '');
    const isTextResult = TEXT_RESULT_TOOLS.has(id ?? '');
    const isImgResult  = IMG_RESULT_TOOLS.has(id ?? '');
    const isNoFile     = NO_FILE_TOOLS.has(id ?? '');
    const toolOpts     = TOOL_OPTIONS[id ?? ''] ?? [];

    const pickFile = async () => {
        try {
            Haptics.selectionAsync();
            let mimeTypes: string[] = ['application/pdf'];
            if (WORD_TOOLS.has(id ?? ''))
                mimeTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
            else if (EXCEL_TOOLS.has(id ?? ''))
                mimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
            else if (id === 'jpg-to-pdf')
                mimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

            const result = await DocumentPicker.getDocumentAsync({
                type: mimeTypes,
                multiple: isMulti,
                copyToCacheDirectory: true,
            });
            if (result.canceled) return;
            setFiles(isMulti ? result.assets : [result.assets[0]]);
            setDone(false);
            setResultUri(null);
            setTextResult(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {
            Alert.alert('خطأ', 'لم نتمكن من الوصول للملف، يرجى المحاولة مجدداً.');
        }
    };

    const execute = async () => {
        if (!isNoFile && files.length === 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('تنبيه', 'يرجى إرفاق المستند أولاً لبدء المعالجة.');
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setLoading(true);
        try {
            const endpoint = `${API_BASE}/${API_MAP[id ?? '']}`;

            // For text-only tools (no file), backend expects JSON. Sending
            // multipart with an empty file list triggers 405/415. Switch
            // request shape based on whether a file is part of the payload.
            const fetchInit: RequestInit = isNoFile
                ? {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(options),
                }
                : (() => {
                    const formData = new FormData();
                    files.forEach((f) => {
                        formData.append(isMulti ? 'files' : 'file', {
                            uri: f.uri,
                            name: f.name,
                            type: f.mimeType ?? 'application/pdf',
                        } as any);
                    });
                    Object.entries(options).forEach(([k, v]) => {
                        if (v) formData.append(k, v);
                    });
                    return {
                        method: 'POST',
                        headers: { Accept: 'application/json' },
                        body: formData,
                    };
                })();

            const res = await fetch(endpoint, fetchInit);

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const serverMessage = err?.error || err?.message;
                throw new Error(arabicErrorForStatus(res.status, serverMessage));
            }

            if (isTextResult) {
                const data = await res.json();
                setTextResult(data?.result ?? data?.text ?? data?.url ?? JSON.stringify(data, null, 2));
                setDone(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                const blob  = await res.blob();
                const ext   = isImgResult ? 'jpg' : 'pdf';
                const local = `${FileSystem.cacheDirectory}amr7_result_${Date.now()}.${ext}`;
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64 = (reader.result as string).split(',')[1];
                    await FileSystem.writeAsStringAsync(local, base64, { encoding: FileSystem.EncodingType.Base64 });
                    setResultUri(local);
                    setDone(true);
                    setLoading(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                };
                reader.readAsDataURL(blob);
                return;
            }
        } catch (e: unknown) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('تعذّر إتمام العملية', arabicErrorForException(e));
        } finally {
            setLoading(false);
        }
    };

    const share = async () => {
        if (!resultUri) return;
        Haptics.selectionAsync();
        const available = await Sharing.isAvailableAsync();
        if (available) {
            await Sharing.shareAsync(resultUri, {
                mimeType: resultUri.endsWith('.jpg') ? 'image/jpeg' : 'application/pdf',
                dialogTitle: 'حفظ / مشاركة المستند',
            });
        } else {
            Alert.alert('تنبيه', 'خاصية المشاركة غير مدعومة على هذا الجهاز.');
        }
    };

    const reset = () => {
        Haptics.selectionAsync();
        setFiles([]); setDone(false);
        setResultUri(null); setTextResult(null); setOptions({});
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
                        <Ionicons
                            name={I18nManager.isRTL ? 'chevron-forward' : 'chevron-back'}
                            size={22}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <View style={styles.toolIconBox}>
                            <ToolIcon tool={tool} size={22} />
                        </View>
                    </View>

                    <View style={{ width: 38 }} />
                </View>

                <View style={styles.headerCopy}>
                    <Text style={styles.toolName}>{tool.name}</Text>
                    <Text style={styles.toolDesc} numberOfLines={3}>{tool.description}</Text>
                </View>
            </View>

            <View style={styles.body}>
                {!isNoFile && !done && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>{isMulti ? 'إرفاق المستندات' : 'إرفاق المستند'}</Text>
                        <TouchableOpacity
                            style={[styles.pickBtn, files.length > 0 && styles.pickBtnFilled]}
                            onPress={pickFile}
                            activeOpacity={0.85}
                        >
                            <View style={[styles.pickIcon, files.length > 0 && styles.pickIconFilled]}>
                                <MaterialCommunityIcons
                                    name={files.length > 0 ? 'file-check-outline' : 'cloud-upload-outline'}
                                    size={26}
                                    color={files.length > 0 ? theme.colors.primary : theme.colors.textMuted}
                                />
                            </View>
                            <Text style={[styles.pickBtnText, files.length > 0 && styles.pickBtnTextFilled]}>
                                {files.length > 0
                                    ? files.length === 1 ? files[0].name : `تم إرفاق ${files.length} مستندات`
                                    : 'اضغط لاختيار الملف'}
                            </Text>
                            <Text style={styles.pickBtnSub}>
                                {files.length > 0 ? 'جاهز للمعالجة' : 'يدعم الحجم حتى 20MB'}
                            </Text>
                        </TouchableOpacity>

                        {files.length > 0 && (
                            <TouchableOpacity style={styles.changeBtn} onPress={reset}>
                                <Text style={styles.changeBtnText}>تغيير الملف</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {!done && toolOpts.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>إعدادات المعالجة</Text>
                        {toolOpts.map((opt) => (
                            <View key={opt.key} style={styles.optionWrap}>
                                <Text style={styles.optionLabel}>{opt.label}</Text>
                                <TextInput
                                    style={[styles.input, opt.multiline && styles.textarea]}
                                    placeholder={opt.placeholder}
                                    placeholderTextColor={theme.colors.textPlaceholder}
                                    value={options[opt.key] ?? ''}
                                    onChangeText={(v) => setOptions((p) => ({ ...p, [opt.key]: v }))}
                                    multiline={opt.multiline}
                                    numberOfLines={opt.multiline ? 4 : 1}
                                    textAlignVertical={opt.multiline ? 'top' : 'center'}
                                    textAlign={RTL_ALIGN}
                                />
                            </View>
                        ))}
                    </View>
                )}

                {!done ? (
                    <TouchableOpacity
                        style={[styles.execBtn, loading && styles.execBtnDisabled]}
                        onPress={execute}
                        activeOpacity={0.9}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={styles.execBtnText}>جاري المعالجة...</Text>
                            </>
                        ) : (
                            <>
                                <MaterialCommunityIcons name="arrow-right-circle" size={20} color="#fff" />
                                <Text style={styles.execBtnText}>بدء المعالجة</Text>
                            </>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View style={styles.resultCard}>
                        <View style={styles.successHeader}>
                            <View style={styles.successIconBox}>
                                <MaterialCommunityIcons name="check" size={28} color={theme.colors.white} />
                            </View>
                            <Text style={styles.successTitle}>تمت المعالجة بنجاح</Text>
                            <Text style={styles.successSub}>تم حذف الملف الأصلي من خوادمنا.</Text>
                        </View>

                        {textResult && (
                            <View style={styles.textResultContainer}>
                                <ScrollView style={styles.textResultBox} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                                    <Text style={styles.textResultContent}>{textResult}</Text>
                                </ScrollView>
                            </View>
                        )}

                        {resultUri && (
                            <TouchableOpacity style={styles.shareBtn} onPress={share} activeOpacity={0.9}>
                                <MaterialCommunityIcons name="share-variant" size={18} color="#fff" />
                                <Text style={styles.shareBtnText}>حفظ / مشاركة</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.resetBtn} onPress={reset} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="refresh" size={16} color={theme.colors.text} />
                            <Text style={styles.resetBtnText}>عملية جديدة</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.supportBanner}
                    onPress={() => router.push({ pathname: '/support', params: { tool: tool.name } })}
                    activeOpacity={0.7}
                >
                    <Ionicons name="help-circle-outline" size={18} color={theme.colors.textMuted} />
                    <Text style={styles.supportBannerText}>تواجه مشكلة؟ تواصل مع فريق الدعم</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const wvStyles = StyleSheet.create({
    header: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.borderLight,
        borderBottomWidth: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
        paddingBottom: 12,
        paddingHorizontal: 16,
    },
    backBtn: {
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    title: {
        color: theme.colors.text,
        flex: 1,
        fontFamily: theme.fonts.black,
        fontSize: 16,
        textAlign: 'center',
    },
    loadingBar: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingVertical: 10,
    },
    loadingText: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
        fontSize: 12,
    },
});

const styles = StyleSheet.create({
    container: { backgroundColor: theme.colors.background, flex: 1 },
    content: { paddingBottom: 40 },

    center: {
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        flex: 1,
        gap: 14,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    notFoundIcon: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        height: 64,
        justifyContent: 'center',
        width: 64,
    },
    notFoundText: { color: theme.colors.text, fontFamily: theme.fonts.black, fontSize: 16, textAlign: 'center' },
    backLink: {
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.full,
        marginTop: 4,
        paddingHorizontal: 22,
        paddingVertical: 10,
    },
    backLinkText: { color: theme.colors.primary, fontFamily: theme.fonts.bold, fontSize: 14 },

    /* --- Header --- */
    header: {
        backgroundColor: theme.colors.background,
        paddingBottom: 12,
        paddingHorizontal: 20,
    },
    headerRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backBtn: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    headerCenter: {
        alignItems: 'center',
    },
    toolIconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.borderBrand,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    headerCopy: {
        marginTop: 16,
    },
    toolName: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 22,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    toolDesc: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 13,
        lineHeight: 20,
        marginTop: 4,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    body: { paddingHorizontal: 20, paddingTop: 8 },

    /* --- Sections --- */
    section: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        marginBottom: 14,
        padding: 16,
    },
    sectionLabel: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 14,
        marginBottom: 14,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    /* --- File picker --- */
    pickBtn: {
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.borderBrand,
        borderRadius: theme.radius.md,
        borderStyle: 'dashed',
        borderWidth: 1.5,
        gap: 10,
        justifyContent: 'center',
        minHeight: 140,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    pickBtnFilled: {
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.primary,
        borderStyle: 'solid',
    },
    pickIcon: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.full,
        height: 48,
        justifyContent: 'center',
        width: 48,
    },
    pickIconFilled: {
        backgroundColor: theme.colors.surface,
    },
    pickBtnText: {
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        fontSize: 14,
        textAlign: 'center',
    },
    pickBtnTextFilled: {
        color: theme.colors.primary,
    },
    pickBtnSub: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 11,
    },
    changeBtn: {
        alignSelf: 'center',
        marginTop: 12,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    changeBtnText: {
        color: theme.colors.danger,
        fontFamily: theme.fonts.bold,
        fontSize: 12,
    },

    /* --- Form options --- */
    optionWrap: { marginBottom: 14 },
    optionLabel: {
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold,
        fontSize: 13,
        marginBottom: 6,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    input: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        color: theme.colors.text,
        fontFamily: theme.fonts.regular,
        fontSize: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    textarea: { height: 120, paddingTop: 14 },

    /* --- Execute --- */
    execBtn: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        marginTop: 6,
        paddingVertical: 16,
        ...theme.shadow.sm,
    },
    execBtnDisabled: { opacity: 0.65 },
    execBtnText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 15,
    },

    /* --- Result --- */
    resultCard: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        gap: 14,
        marginTop: 6,
        padding: 18,
    },
    successHeader: {
        alignItems: 'center',
        borderBottomColor: theme.colors.borderLight,
        borderBottomWidth: 1,
        paddingBottom: 14,
    },
    successIconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.success,
        borderRadius: theme.radius.full,
        height: 52,
        justifyContent: 'center',
        marginBottom: 10,
        width: 52,
    },
    successTitle: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'center',
    },
    successSub: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        textAlign: 'center',
    },

    textResultContainer: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.md,
        borderWidth: 1,
    },
    textResultBox: {
        maxHeight: 240,
        padding: 14,
    },
    textResultContent: {
        color: theme.colors.text,
        fontFamily: theme.fonts.regular,
        fontSize: 14,
        lineHeight: 24,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    shareBtn: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingVertical: 14,
    },
    shareBtnText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 14,
    },

    resetBtn: {
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: theme.radius.md,
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        paddingVertical: 12,
    },
    resetBtnText: {
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        fontSize: 13,
    },

    supportBanner: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        marginTop: 16,
        paddingVertical: 12,
    },
    supportBannerText: {
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
    },
});
