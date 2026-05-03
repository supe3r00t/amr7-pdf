import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    I18nManager,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { AppHeader, Chip } from '@/components/premium-ui';

const RTL_ALIGN = I18nManager.isRTL ? 'right' : 'left';
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
        Haptics.selectionAsync();
        setIssueType(type);
    };

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

            const responseData = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(responseData?.message || responseData?.error || `خطأ من الخادم برمز: ${response.status}`);
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('تم الاستلام', 'وصلنا طلبك بنجاح. سيتواصل معك فريقنا في أقرب وقت.');

            setMessage('');
            setName('');
            setToolName('');
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
                <AppHeader
                    eyebrow="الدعم الفني"
                    title="مركز المساعدة"
                    subtitle="نحن هنا لدعمك. شاركنا تفاصيل طلبك."
                    showBack
                    onBack={() => router.back()}
                />

                <View style={styles.formContainer}>
                    <View style={styles.section}>
                        <Text style={styles.label}>نوع الطلب</Text>
                        <View style={styles.chips}>
                            {ISSUE_TYPES.map((t) => (
                                <Chip
                                    key={t}
                                    label={t}
                                    active={issueType === t}
                                    onPress={() => handleTypeSelect(t)}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>الاسم <Text style={styles.optional}>(اختياري)</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="اسمك الكريم"
                            placeholderTextColor={theme.colors.textPlaceholder}
                            value={name}
                            onChangeText={setName}
                            textAlign={RTL_ALIGN}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>الأداة المرتبطة <Text style={styles.optional}>(اختياري)</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="مثال: دمج PDF"
                            placeholderTextColor={theme.colors.textPlaceholder}
                            value={toolName}
                            onChangeText={setToolName}
                            textAlign={RTL_ALIGN}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>التفاصيل <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            placeholder="اكتب تفاصيل طلبك أو استفسارك بوضوح..."
                            placeholderTextColor={theme.colors.textPlaceholder}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            textAlign={RTL_ALIGN}
                        />
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.btnPrimary, sending && styles.btnDisabled]}
                        onPress={send}
                        activeOpacity={0.9}
                        disabled={sending}
                    >
                        {sending ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                        )}
                        <Text style={styles.btnPrimaryText}>{sending ? 'جاري الإرسال...' : 'إرسال الطلب'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnWA} onPress={sendWhatsApp} activeOpacity={0.85}>
                        <Ionicons name="logo-whatsapp" size={18} color={theme.colors.success} />
                        <Text style={styles.btnWAText}>واتساب فوري</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: theme.colors.background, flex: 1 },
    content: { flexGrow: 1 },

    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },

    section: {
        marginTop: 18,
    },
    label: {
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        fontSize: 13,
        marginBottom: 8,
        textAlign: RTL_ALIGN,
    },
    optional: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
    },
    required: {
        color: theme.colors.danger,
        fontFamily: theme.fonts.black,
    },

    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

    input: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        color: theme.colors.text,
        fontFamily: theme.fonts.regular,
        fontSize: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    textarea: { height: 140, paddingTop: 14 },

    actions: {
        gap: 10,
        marginHorizontal: 20,
        marginTop: 24,
    },
    btnPrimary: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingVertical: 14,
        ...theme.shadow.sm,
    },
    btnDisabled: { opacity: 0.65 },
    btnPrimaryText: { color: theme.colors.white, fontFamily: theme.fonts.black, fontSize: 14 },
    btnWA: {
        alignItems: 'center',
        backgroundColor: theme.colors.successBg,
        borderColor: 'rgba(16, 185, 129, 0.20)',
        borderRadius: theme.radius.md,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingVertical: 14,
    },
    btnWAText: { color: theme.colors.success, fontFamily: theme.fonts.black, fontSize: 14 },
});
