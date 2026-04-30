import { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    Linking,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Keyboard,
    I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';

const ISSUE_TYPES = ['استفسار عام', 'مشكلة تقنية', 'اقتراح تطوير', 'شراكة أعمال'];

export default function SupportScreen() {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ tool?: string }>();

    const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [toolName, setToolName] = useState(params.tool ?? '');
    const [sending, setSending] = useState(false);

    const handleTypeSelect = (type: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIssueType(type);
    };

    // 🚀 تحديث دالة الإرسال مع نظام تتبع الأخطاء المتقدم (Debugging System)
    const send = async () => {
        Keyboard.dismiss();

        if (!message.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('تنبيه', 'يرجى تزويدنا بتفاصيل طلبك لنتمكن من مساعدتك.');
            return;
        }

        setSending(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            console.log('⏳ [SupportScreen] جاري إرسال الطلب إلى الخادم...');
            console.log('📦 [SupportScreen] البيانات المرسلة:', { issueType, name, toolName, message });

            const response = await fetch('https://pdf.amr7.io/api/support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    type: issueType,
                    name: name.trim() || 'غير محدد',
                    tool: toolName.trim() || 'غير محدد',
                    message: message.trim(),
                }),
            });

            // محاولة قراءة رد الخادم
            const responseData = await response.json().catch(() => null);
            console.log('📥 [SupportScreen] حالة الرد من الخادم:', response.status);
            console.log('📥 [SupportScreen] بيانات الرد:', responseData);

            if (!response.ok) {
                // إذا فشل الطلب، نرمي خطأ يحتوي على رسالة السيرفر
                throw new Error(responseData?.message || responseData?.error || `خطأ من الخادم برمز: ${response.status}`);
            }

            // في حال النجاح
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('تم الاستلام', 'وصلنا طلبك بنجاح. سيتواصل معك فريقنا في أقرب وقت.');

            setMessage('');
            setName('');
            setToolName('');

        } catch (error: any) {
            console.error('❌ [SupportScreen] فشل الإرسال:', error.message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            // عرض تنبيه أفضل للمستخدم بناءً على نوع الخطأ
            const isNetworkError = error.message === 'Network request failed' || error.message.includes('Network');
            const alertMessage = isNetworkError
                ? 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى.'
                : 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.';

            Alert.alert('عذراً', `${alertMessage}\n\nيمكنك استخدام محادثة واتساب كبديل فوري.`);
        } finally {
            setSending(false);
        }
    };

    const sendWhatsApp = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const text = [`التصنيف: ${issueType}`, `الأداة: ${toolName || 'عام'}`, `التفاصيل:\n${message || '-'}`].join('\n\n');
        await Linking.openURL(`https://wa.me/966505336956?text=${encodeURIComponent(text)}`);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Section */}
                <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons
                            name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
                            size={22}
                            color={theme.colors.white}
                        />
                    </TouchableOpacity>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>مركز المساعدة</Text>
                        <Text style={styles.sub}>نحن هنا لدعمك وتسهيل أعمالك</Text>
                    </View>
                </View>

                {/* Form Sections */}
                <View style={styles.formContainer}>
                    {/* Issue Type */}
                    <View style={styles.section}>
                        <Text style={styles.label}>كيف يمكننا مساعدتك؟</Text>
                        <View style={styles.chips}>
                            {ISSUE_TYPES.map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[styles.chip, issueType === t && styles.chipActive]}
                                    onPress={() => handleTypeSelect(t)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.chipText, issueType === t && styles.chipTextActive]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Name */}
                    <View style={styles.section}>
                        <Text style={styles.label}>الاسم (اختياري)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="أدخل اسمك الكريم"
                            placeholderTextColor={theme.colors.textMuted}
                            value={name}
                            onChangeText={setName}
                            textAlign={I18nManager.isRTL ? 'right' : 'left'}
                        />
                    </View>

                    {/* Tool */}
                    <View style={styles.section}>
                        <Text style={styles.label}>الأداة المرتبطة (إن وجدت)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="مثال: دمج PDF"
                            placeholderTextColor={theme.colors.textMuted}
                            value={toolName}
                            onChangeText={setToolName}
                            textAlign={I18nManager.isRTL ? 'right' : 'left'}
                        />
                    </View>

                    {/* Message */}
                    <View style={styles.section}>
                        <Text style={styles.label}>التفاصيل *</Text>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            placeholder="يرجى كتابة تفاصيل طلبك أو استفسارك هنا بوضوح..."
                            placeholderTextColor={theme.colors.textMuted}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            textAlign={I18nManager.isRTL ? 'right' : 'left'}
                        />
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.btnPrimary, sending && { opacity: 0.7 }]}
                        onPress={send}
                        activeOpacity={0.82}
                        disabled={sending}
                    >
                        {sending ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Ionicons name="paper-plane-outline" size={20} color="#fff" style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }} />
                        )}
                        <Text style={styles.btnPrimaryText}>{sending ? 'جاري الإرسال...' : 'إرسال الطلب'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnWA} onPress={sendWhatsApp} activeOpacity={0.82}>
                        <Ionicons name="logo-whatsapp" size={20} color="#1A9B6C" />
                        <Text style={styles.btnWAText}>محادثة فورية عبر واتساب</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flexGrow: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.brandDeep,
        marginHorizontal: 14,
        marginTop: 8,
        borderRadius: 26,
        overflow: 'hidden',
        ...theme.shadow.lg,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: theme.radius.md,
        backgroundColor: 'rgba(255,255,255,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.16)',
        marginEnd: 16,
    },
    headerText: { flex: 1 },
    title: { fontSize: 24, color: theme.colors.white, fontFamily: theme.fonts.black, textAlign: I18nManager.isRTL ? 'right' : 'left' },
    sub: { fontSize: 14, color: 'rgba(239,255,253,0.76)', fontFamily: theme.fonts.medium, marginTop: 4, textAlign: I18nManager.isRTL ? 'right' : 'left' },

    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    section: {
        marginTop: 24,
    },
    label: {
        fontSize: 15,
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        marginBottom: 12,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },

    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    chipActive: {
        backgroundColor: theme.colors.text,
        borderColor: theme.colors.text
    },
    chipText: { fontSize: 14, color: theme.colors.textSecondary, fontFamily: theme.fonts.medium },
    chipTextActive: { color: theme.colors.white, fontFamily: theme.fonts.bold },

    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: theme.colors.text,
        fontFamily: theme.fonts.regular,
    },
    textarea: { height: 160, paddingTop: 16 },

    actions: { marginHorizontal: 20, marginTop: 40, gap: 14 },
    btnPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        paddingVertical: 16,
        ...theme.shadow.sm,
    },
    btnPrimaryText: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.bold },
    btnWA: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: theme.colors.successBg,
        borderRadius: theme.radius.md,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#C6EEDB',
    },
    btnWAText: { color: theme.colors.success, fontSize: 16, fontFamily: theme.fonts.bold },
});
