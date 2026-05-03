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
import {
    arabicErrorForException,
    arabicErrorForStatus,
    logRequestFailure,
} from '@/constants/api-errors';
import { AppHeader, Chip, PremiumCard } from '@/components/premium-ui';
import { ScreenBackground } from '@/components/screen-background';

const RTL_ALIGN = I18nManager.isRTL ? 'right' : 'left';
const ISSUE_TYPES = ['استفسار عام', 'مشكلة تقنية', 'اقتراح تطوير', 'شراكة أعمال'];
const SUPPORT_ENDPOINT = 'https://pdf.amr7.sa/api/support';

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
            const response = await fetch(SUPPORT_ENDPOINT, {
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
                logRequestFailure({
                    endpoint: SUPPORT_ENDPOINT,
                    method: 'POST',
                    status: response.status,
                    body: responseData,
                });
                const serverMessage = responseData?.message || responseData?.error;
                throw new Error(arabicErrorForStatus(response.status, serverMessage));
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('تم الاستلام', 'وصلنا طلبك بنجاح. سيتواصل معك فريقنا في أقرب وقت.');

            setMessage('');
            setName('');
            setToolName('');
        } catch (error: unknown) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('تعذّر الإرسال', `${arabicErrorForException(error)}\n\nيمكنك استخدام واتساب كبديل فوري.`);
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
        <ScreenBackground>
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
                        subtitle="شاركنا تفاصيل طلبك وسنرد في أقرب وقت."
                        showBack
                        onBack={() => router.back()}
                    />

                    <PremiumCard style={styles.formCard}>
                        <View style={styles.field}>
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

                        <View style={styles.field}>
                            <Text style={styles.label}>
                                الاسم <Text style={styles.optional}>(اختياري)</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="اسمك الكريم"
                                placeholderTextColor={theme.colors.textPlaceholder}
                                value={name}
                                onChangeText={setName}
                                textAlign={RTL_ALIGN}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>
                                الأداة المرتبطة <Text style={styles.optional}>(اختياري)</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="مثال: دمج PDF"
                                placeholderTextColor={theme.colors.textPlaceholder}
                                value={toolName}
                                onChangeText={setToolName}
                                textAlign={RTL_ALIGN}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>
                                التفاصيل <Text style={styles.required}>*</Text>
                            </Text>
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
                    </PremiumCard>

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
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flexGrow: 1 },

    formCard: {
        marginHorizontal: 20,
        marginTop: 8,
        padding: 18,
    },

    field: {
        marginTop: 14,
    },
    label: {
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        fontSize: 13,
        marginBottom: 8,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
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
        backgroundColor: theme.colors.surfaceAlt,
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
        marginTop: 20,
    },
    btnPrimary: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 8,
        justifyContent: 'center',
        minHeight: 56,
        paddingVertical: 16,
        ...theme.shadow.md,
    },
    btnDisabled: { opacity: 0.65 },
    btnPrimaryText: { color: theme.colors.white, fontFamily: theme.fonts.black, fontSize: 14 },
    btnWA: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.md,
        borderWidth: 1.5,
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 8,
        justifyContent: 'center',
        minHeight: 56,
        paddingVertical: 16,
    },
    btnWAText: { color: theme.colors.success, fontFamily: theme.fonts.black, fontSize: 14 },
});
