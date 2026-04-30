import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    TextInput,
    Platform,
    I18nManager,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { getToolById } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';

// ─── ثوابت ───────────────────────────────────────────────
const API_BASE    = 'https://pdf.amr7.io/api';
const WEB_BASE    = 'https://pdf.amr7.io/tools';

// أدوات تُفتح في WebView (لا يوجد API مباشر لها)
const WEBVIEW_TOOLS = new Set([
    'sign-pdf', 'fill-pdf-form', 'edit-pdf-text', 'pdf-reader',
    'scan-document', 'redact-pdf', 'translate-pdf', 'compare-pdf',
    'pdf-to-excel', 'pdf-to-pptx', 'pdf-a', 'html-to-pdf',
    'ai-image-gen', 'qr-code', 'barcode', 'invoice',
    'whatsapp-link', 'email-signature', 'text-tools', 'calculators',
    'color-tools', 'image-tools', 'dev-tools', 'zakat', 'support',
]);

// slug الأداة في الموقع (إذا اختلف عن id)
const WEB_SLUG: Record<string, string> = {
    'ai-chat':          'ai-chat-pdf',
    'ai-summarize':     'ai-summarizer',
    'ai-tables':        'ai-extract-tables',
    'ai-image-gen':     'ai-image-gen',
    'prompt-gen':       'prompt-generator',
    'prompt-check':     'prompt-checker',
    'header-footer':    'header-footer-pdf',
    'edit-metadata':    'edit-metadata',
    'pdf-to-pptx':      'pdf-to-pptx',
    'pdf-to-excel':     'pdf-to-excel',
    'html-to-pdf':      'html-to-pdf',
    'pdf-a':            'pdf-a',
    'sign-pdf':         'sign-pdf',
    'scan-document':    'scan-document',
    'fill-pdf-form':    'fill-pdf-form',
    'edit-pdf-text':    'edit-pdf-text',
    'pdf-reader':       'pdf-reader',
    'redact-pdf':       'redact-pdf',
    'translate-pdf':    'translate-pdf',
    'compare-pdf':      'compare-pdf',
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
    protect:         [{ label: 'كلمة المرور الجديدة', key: 'password', placeholder: 'أدخل كلمة المرور لحماية الملف' }],
    unlock:          [{ label: 'كلمة المرور الحالية', key: 'password', placeholder: 'أدخل كلمة المرور لفتح الملف' }],
    watermark:       [{ label: 'نص العلامة المائية', key: 'text', placeholder: 'سري | نسخة تجريبية' }],
    'edit-metadata': [
        { label: 'عنوان الملف', key: 'title', placeholder: 'اسم المستند الجديد' },
        { label: 'اسم المؤلف', key: 'author', placeholder: 'اسم الكاتب أو الجهة' },
    ],
    'ai-chat':       [{ label: 'السؤال أو الطلب', key: 'question', placeholder: 'اطلب تلخيصاً، أو اسأل عن أي معلومة في الملف...', multiline: true }],
    'prompt-gen':    [{ label: 'الفكرة الأساسية', key: 'idea', placeholder: 'اشرح الفكرة التي تريد تحويلها إلى أمر (Prompt) احترافي...', multiline: true }],
    'prompt-check':  [{ label: 'الأمر (Prompt) الحالي', key: 'prompt', placeholder: 'ألصق الأمر هنا ليقوم الذكاء الاصطناعي بتقييمه وتحسينه...', multiline: true }],
    humanizer:       [{ label: 'النص المولد آلياً', key: 'text', placeholder: 'ألصق النص هنا لإعادة صياغته بأسلوب بشري طبيعي...', multiline: true }],
    'ai-detector':   [{ label: 'النص المراد فحصه', key: 'text', placeholder: 'ألصق النص هنا لمعرفة نسبة توليده بالذكاء الاصطناعي...', multiline: true }],
};

// ─── مكوّن WebView ────────────────────────────────────────
function ToolWebView({ toolId, toolName, onBack }: { toolId: string; toolName: string; onBack: () => void }) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const slug = WEB_SLUG[toolId] ?? toolId;
    const url  = `${WEB_BASE}/${slug}`;

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header */}
            <View style={[wvStyles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
                <TouchableOpacity style={wvStyles.backBtn} onPress={onBack} activeOpacity={0.8}>
                    <Ionicons
                        name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
                        size={22}
                        color={theme.colors.white}
                    />
                </TouchableOpacity>
                <Text style={wvStyles.title} numberOfLines={1}>{toolName}</Text>
                {/* Spacer للحفاظ على التوسيط */}
                <View style={{ width: 44 }} />
            </View>

            {/* Loading Indicator */}
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

    // ── أداة غير موجودة ──
    if (!tool) {
        return (
            <View style={styles.center}>
                <MaterialCommunityIcons name="alert-circle-outline" size={56} color={theme.colors.textMuted} />
                <Text style={styles.notFoundText}>الأداة غير متوفرة حالياً</Text>
                <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
                    <Text style={styles.backLinkText}>العودة للرئيسية</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ── أداة WebView ──
    if (WEBVIEW_TOOLS.has(id ?? '')) {
        return <ToolWebView toolId={id!} toolName={tool.name} onBack={() => router.back()} />;
    }

    // ── منطق API ──
    const isMulti      = MULTI_FILE_TOOLS.has(id ?? '');
    const isTextResult = TEXT_RESULT_TOOLS.has(id ?? '');
    const isImgResult  = IMG_RESULT_TOOLS.has(id ?? '');
    const isNoFile     = NO_FILE_TOOLS.has(id ?? '');
    const toolOpts     = TOOL_OPTIONS[id ?? ''] ?? [];

    const pickFile = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
            const formData = new FormData();

            if (!isNoFile) {
                files.forEach((f) => {
                    formData.append(isMulti ? 'files' : 'file', {
                        uri: f.uri, name: f.name,
                        type: f.mimeType ?? 'application/pdf',
                    } as any);
                });
            }
            Object.entries(options).forEach(([k, v]) => { if (v) formData.append(k, v); });

            const res = await fetch(endpoint, { method: 'POST', body: formData });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error ?? `حدث خطأ أثناء الاتصال بالخادم (${res.status})`);
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
        } catch (e: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('عذراً', e.message ?? 'حدث خطأ غير متوقع أثناء المعالجة.');
        } finally {
            setLoading(false);
        }
    };

    const share = async () => {
        if (!resultUri) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFiles([]); setDone(false);
        setResultUri(null); setTextResult(null); setOptions({});
    };

    // ── UI ──
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 60 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
                <View style={styles.headerAccent} />
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons
                        name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
                        size={22}
                        color={theme.colors.white}
                    />
                </TouchableOpacity>
                <View style={styles.headerMain}>
                    <View style={styles.toolIconBox}>
                        <ToolIcon tool={tool} size={28} />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.toolName}>{tool.name}</Text>
                        <Text style={styles.toolDesc} numberOfLines={2}>{tool.description}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.body}>

                {/* File Dropzone Area */}
                {!isNoFile && !done && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>{isMulti ? 'إرفاق المستندات' : 'إرفاق المستند'}</Text>
                        <TouchableOpacity
                            style={[styles.pickBtn, files.length > 0 && styles.pickBtnFilled]}
                            onPress={pickFile}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name={files.length > 0 ? 'file-check-outline' : 'file-upload-outline'}
                                size={32}
                                color={files.length > 0 ? theme.colors.primary : theme.colors.textMuted}
                                style={{ marginBottom: 8 }}
                            />
                            <Text style={[styles.pickBtnText, files.length > 0 && styles.pickBtnTextFilled]}>
                                {files.length > 0
                                    ? files.length === 1 ? files[0].name : `تم إرفاق ${files.length} مستندات`
                                    : 'اضغط هنا لاختيار الملف من جهازك'}
                            </Text>
                            {files.length === 0 && (
                                <Text style={styles.pickBtnSub}>يدعم الحجم حتى 20MB</Text>
                            )}
                        </TouchableOpacity>

                        {/* Clear Files Button */}
                        {files.length > 0 && (
                            <TouchableOpacity style={styles.clearFilesBtn} onPress={reset}>
                                <Text style={styles.clearFilesText}>تغيير الملف</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Options Form */}
                {!done && toolOpts.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>إعدادات المعالجة</Text>
                        {toolOpts.map((opt) => (
                            <View key={opt.key} style={styles.optionWrap}>
                                <Text style={styles.optionLabel}>{opt.label}</Text>
                                <TextInput
                                    style={[styles.input, opt.multiline && styles.textarea]}
                                    placeholder={opt.placeholder}
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={options[opt.key] ?? ''}
                                    onChangeText={(v) => setOptions((p) => ({ ...p, [opt.key]: v }))}
                                    multiline={opt.multiline}
                                    numberOfLines={opt.multiline ? 4 : 1}
                                    textAlignVertical={opt.multiline ? 'top' : 'center'}
                                    textAlign={I18nManager.isRTL ? 'right' : 'left'}
                                />
                            </View>
                        ))}
                    </View>
                )}

                {/* Execute Button */}
                {!done ? (
                    <TouchableOpacity
                        style={[styles.execBtn, loading && styles.execBtnDisabled]}
                        onPress={execute}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={styles.execBtnText}>جاري المعالجة الآمنة...</Text>
                            </>
                        ) : (
                            <>
                                <MaterialCommunityIcons name="lightning-bolt" size={22} color="#fff" />
                                <Text style={styles.execBtnText}>بدء المعالجة</Text>
                            </>
                        )}
                    </TouchableOpacity>
                ) : (
                    /* Success Result Card */
                    <View style={styles.resultCard}>
                        <View style={styles.successHeader}>
                            <View style={styles.successIconBox}>
                                <MaterialCommunityIcons name="check-decagram" size={32} color={theme.colors.success} />
                            </View>
                            <Text style={styles.successTitle}>تم إنجاز المهمة بنجاح</Text>
                            <Text style={styles.successSub}>تمت المعالجة وحذف الملفات الأصلية من خوادمنا.</Text>
                        </View>

                        {/* Text Result Container */}
                        {textResult && (
                            <View style={styles.textResultContainer}>
                                <ScrollView style={styles.textResultBox} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                                    <Text style={styles.textResultContent}>{textResult}</Text>
                                </ScrollView>
                            </View>
                        )}

                        {/* File Result Actions */}
                        {resultUri && (
                            <TouchableOpacity style={styles.shareBtn} onPress={share} activeOpacity={0.85}>
                                <MaterialCommunityIcons name="export-variant" size={20} color="#fff" />
                                <Text style={styles.shareBtnText}>حفظ / مشاركة المستند</Text>
                            </TouchableOpacity>
                        )}

                        {/* Reset Action */}
                        <TouchableOpacity style={styles.resetBtn} onPress={reset} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="refresh" size={18} color={theme.colors.primaryDark} />
                            <Text style={styles.resetBtnText}>إجراء عملية جديدة</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Support Banner */}
                <TouchableOpacity
                    style={styles.supportBanner}
                    onPress={() => router.push({ pathname: '/support', params: { tool: tool.name } })}
                    activeOpacity={0.8}
                >
                    <MaterialCommunityIcons name="lifebuoy" size={20} color={theme.colors.textMuted} />
                    <Text style={styles.supportBannerText}>هل تواجه مشكلة مع هذه الأداة؟ فريقنا جاهز للمساعدة.</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

// ─── Styles ──────────────────────────────────────────────
const wvStyles = StyleSheet.create({
    header: {
        backgroundColor: theme.colors.brandDeep,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(31,167,162,0.22)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 44, height: 44,
        borderRadius: theme.radius.md,
        backgroundColor: 'rgba(255,255,255,0.10)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)',
    },
    title: {
        flex: 1,
        fontSize: 18,
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    loadingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 12,
        backgroundColor: theme.colors.primarySoft,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.primaryLight,
    },
    loadingText: {
        fontSize: 13,
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
    },
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content:   { paddingBottom: 60 },

    center: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        gap: 16, backgroundColor: theme.colors.background,
        paddingHorizontal: 32,
    },
    notFoundText: { fontSize: 18, color: theme.colors.text, fontFamily: theme.fonts.black, textAlign: 'center' },
    backLink:     { marginTop: 8, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: theme.colors.surface, borderRadius: theme.radius.full, borderWidth: 1, borderColor: theme.colors.border },
    backLinkText: { fontSize: 15, color: theme.colors.primary, fontFamily: theme.fonts.bold },

    /* --- Header --- */
    header: {
        backgroundColor: theme.colors.brandDeep,
        borderColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1,
        paddingBottom: 28,
        paddingHorizontal: 20,
        marginHorizontal: 14,
        marginTop: 8,
        borderRadius: 26,
        gap: 20,
        overflow: 'hidden',
        ...theme.shadow.lg,
    },
    headerAccent: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        height: 3,
        backgroundColor: theme.colors.primary,
    },
    backBtn: {
        width: 44, height: 44,
        borderRadius: theme.radius.md,
        backgroundColor: 'rgba(255,255,255,0.10)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)',
        alignSelf: 'flex-start',
    },
    headerMain: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    toolIconBox: {
        width: 64, height: 64,
        borderRadius: 18,
        backgroundColor: theme.colors.brandInk,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.14)',
    },
    headerText:  { flex: 1, alignItems: 'flex-start' },
    toolName:    { fontSize: 22, color: theme.colors.white, fontFamily: theme.fonts.black, textAlign: I18nManager.isRTL ? 'right' : 'left', marginBottom: 4 },
    toolDesc:    { fontSize: 14, color: 'rgba(239,255,253,0.76)', fontFamily: theme.fonts.medium, textAlign: I18nManager.isRTL ? 'right' : 'left', lineHeight: 22 },

    body: { padding: 20, gap: 8 },

    /* --- Sections --- */
    section: {
        marginBottom: 24,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        padding: 16,
        ...theme.shadow.sm,
    },
    sectionLabel: { fontSize: 15, color: theme.colors.text, fontFamily: theme.fonts.black, textAlign: I18nManager.isRTL ? 'right' : 'left', marginBottom: 12 },

    /* --- File Dropzone --- */
    pickBtn: {
        backgroundColor: theme.colors.background,
        borderRadius: 22,
        borderWidth: 1.5, borderColor: theme.colors.borderBrand,
        borderStyle: 'dashed',
        paddingVertical: 34, paddingHorizontal: 20,
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 168,
        ...theme.shadow.sm,
    },
    pickBtnFilled: {
        borderStyle: 'solid',
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primarySoft,
        paddingVertical: 24,
    },
    pickBtnText: {
        fontSize: 15, color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold, textAlign: 'center',
    },
    pickBtnTextFilled: { color: theme.colors.primaryDark, fontSize: 16 },
    pickBtnSub: {
        fontSize: 12, color: theme.colors.textMuted,
        fontFamily: theme.fonts.regular, marginTop: 6,
    },
    clearFilesBtn: {
        alignSelf: 'center',
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    clearFilesText: {
        color: theme.colors.danger,
        fontSize: 13,
        fontFamily: theme.fonts.bold,
    },

    /* --- Form Options --- */
    optionWrap:  { marginBottom: 16 },
    optionLabel: { fontSize: 14, color: theme.colors.textSecondary, fontFamily: theme.fonts.bold, textAlign: I18nManager.isRTL ? 'right' : 'left', marginBottom: 8 },
    input: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.md,
        borderWidth: 1, borderColor: theme.colors.borderLight,
        paddingHorizontal: 16, paddingVertical: 14,
        fontSize: 15, color: theme.colors.text,
        fontFamily: theme.fonts.regular,
    },
    textarea: { height: 130, paddingTop: 16 },

    /* --- Actions --- */
    execBtn: {
        backgroundColor: theme.colors.primary,
        borderRadius: 18,
        paddingVertical: 18,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        marginTop: 10,
        ...theme.shadow.sm,
    },
    execBtnDisabled: { opacity: 0.7 },
    execBtnText: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.black },

    /* --- Success Result Card --- */
    resultCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.xl,
        borderWidth: 1, borderColor: theme.colors.borderLight,
        padding: 24, marginTop: 10, gap: 20,
        ...theme.shadow.md,
    },
    successHeader: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: 20,
    },
    successIconBox: {
        width: 64, height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.successBg,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
    },
    successTitle: { fontSize: 18, color: theme.colors.text, fontFamily: theme.fonts.black, textAlign: 'center', marginBottom: 6 },
    successSub: { fontSize: 13, color: theme.colors.textMuted, fontFamily: theme.fonts.regular, textAlign: 'center', lineHeight: 20 },

    textResultContainer: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.md,
        borderWidth: 1, borderColor: theme.colors.border,
        padding: 4,
    },
    textResultBox: {
        padding: 16, maxHeight: 250,
    },
    textResultContent: {
        fontSize: 15, color: theme.colors.text,
        fontFamily: theme.fonts.regular, textAlign: I18nManager.isRTL ? 'right' : 'left', lineHeight: 26,
    },

    shareBtn: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md, paddingVertical: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        ...theme.shadow.sm,
    },
    shareBtnText: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.bold },

    resetBtn: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        paddingVertical: 12,
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: theme.radius.md,
        borderWidth: 1, borderColor: theme.colors.border,
    },
    resetBtnText: { fontSize: 14, color: theme.colors.primaryDark, fontFamily: theme.fonts.bold },

    /* --- Support Banner --- */
    supportBanner: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 8, marginTop: 32,
        backgroundColor: theme.colors.surface,
        paddingVertical: 16, paddingHorizontal: 16,
        borderRadius: theme.radius.lg,
        borderWidth: 1, borderColor: theme.colors.borderLight,
    },
    supportBannerText: { flex: 1, fontSize: 13, color: theme.colors.textSecondary, fontFamily: theme.fonts.regular, textAlign: I18nManager.isRTL ? 'right' : 'left' },
});
