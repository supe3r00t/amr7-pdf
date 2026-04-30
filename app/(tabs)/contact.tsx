import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
    I18nManager,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { AppHeader, PremiumCard } from '@/components/premium-ui';

const CONTACTS = [
    {
        id: 'unified',
        label: 'الرقم الموحد',
        value: '920017083', // ⚠️ يرجى استبدال هذا الرقم برقمك الموحد الفعلي
        icon: 'phone-classic',
        color: '#FF9800',
        bg: '#FFF3E0',
        action: () => Linking.openURL('tel:920017083'), // ⚠️ وتعديله هنا أيضاً
    },
    {
        id: 'whatsapp',
        label: 'محادثة فورية (واتساب)',
        value: '0505336956',
        icon: 'whatsapp',
        color: '#25D366',
        bg: '#EDFBF2',
        action: () => Linking.openURL('https://wa.me/966505336956'),
    },
    {
        id: 'phone',
        label: 'الاتصال المباشر',
        value: '0505336956',
        icon: 'phone-outline',
        color: theme.colors.primary,
        bg: theme.colors.primarySoft,
        action: () => Linking.openURL('tel:0505336956'),
    },
    {
        id: 'email',
        label: 'البريد الإلكتروني للأعمال',
        value: 'info@amr-7.sa',
        icon: 'email-outline',
        color: '#EA4335',
        bg: '#FEF0EE',
        action: () => Linking.openURL('mailto:info@amr-7.sa'),
    },
    {
        id: 'website',
        label: 'بوابة الويب الرسمية',
        value: 'amr-7.sa',
        icon: 'web',
        color: theme.colors.primaryDark,
        bg: '#EFF4FA',
        action: () => Linking.openURL('https://amr-7.sa'),
    },
];

const SOCIAL = [
    {
        id: 'instagram',
        label: 'إنستغرام',
        family: 'MaterialCommunityIcons',
        icon: 'instagram',
        color: '#E4405F',
        url: 'https://www.instagram.com/amr7.sa/'
    },
    {
        id: 'tiktok',
        label: 'تيك توك',
        family: 'FontAwesome5',
        icon: 'tiktok',
        color: '#000000',
        url: 'https://www.tiktok.com/@amr7sa3'
    },
    {
        id: 'linkedin',
        label: 'لينكد إن',
        family: 'MaterialCommunityIcons',
        icon: 'linkedin',
        color: '#0A66C2',
        url: 'https://www.linkedin.com/in/ahmed-alammar-5893a121b/'
    },
];

export default function ContactScreen() {
    const insets = useSafeAreaInsets();

    const handleActionPress = async (action: () => void) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await action();
    };

    const handleSocialPress = async (url: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await Linking.openURL(url);
    };

    const openSupportTicket = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/support'); // توجيه المستخدم لشاشة الدعم الفني التي صممناها سابقاً
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 48 }]}
            showsVerticalScrollIndicator={false}
        >
            <AppHeader
                eyebrow="فريقنا متواجد لدعم أعمالك"
                title="العناية بالعملاء"
                subtitle="اختر قناة التواصل المناسبة، أو افتح تذكرة دعم عند الحاجة."
                icon="headset"
                compact
            />

            {/* Support Ticket CTA (Call to Action) */}
            <View style={styles.supportCtaContainer}>
                <TouchableOpacity
                    style={styles.supportCtaBtn}
                    onPress={openSupportTicket}
                    activeOpacity={0.8}
                >
                    <View style={styles.supportCtaTextWrap}>
                        <Text style={styles.supportCtaTitle}>تحتاج مساعدة تقنية؟</Text>
                        <Text style={styles.supportCtaDesc}>افتح تذكرة دعم وسنقوم بحل مشكلتك فوراً</Text>
                    </View>
                    <View style={styles.supportCtaIconBox}>
                        <MaterialCommunityIcons
                            name={I18nManager.isRTL ? "arrow-left" : "arrow-right"}
                            size={20}
                            color={theme.colors.surface}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Contact Cards */}
            <PremiumCard style={styles.section}>
                <Text style={styles.sectionTitle}>قنوات الاتصال المباشر</Text>
                {CONTACTS.map((c, index) => (
                    <TouchableOpacity
                        key={c.id}
                        style={[styles.contactCard, index === CONTACTS.length - 1 && { borderBottomWidth: 0 }]}
                        onPress={() => handleActionPress(c.action)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.contactIconBox, { backgroundColor: c.bg }]}>
                            <MaterialCommunityIcons name={c.icon as any} size={22} color={c.color} />
                        </View>

                        <View style={styles.contactInfo}>
                            <Text style={styles.contactValue}>{c.value}</Text>
                            <Text style={styles.contactLabel}>{c.label}</Text>
                        </View>

                        {/* Smart RTL Arrow */}
                        <MaterialCommunityIcons
                            name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
                            size={20}
                            color={theme.colors.textMuted}
                        />
                    </TouchableOpacity>
                ))}
            </PremiumCard>

            {/* Social */}
            <PremiumCard style={styles.section}>
                <Text style={styles.sectionTitle}>المنصات الاجتماعية</Text>
                <View style={styles.socialRow}>
                    {SOCIAL.map((s) => (
                        <TouchableOpacity
                            key={s.id}
                            style={styles.socialBtn}
                            onPress={() => handleSocialPress(s.url)}
                            activeOpacity={0.7}
                        >
                            {s.family === 'FontAwesome5' ? (
                                <FontAwesome5 name={s.icon as any} size={22} color={s.color} />
                            ) : (
                                <MaterialCommunityIcons name={s.icon as any} size={24} color={s.color} />
                            )}
                            <Text style={styles.socialLabel}>{s.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </PremiumCard>

            {/* Support Note */}
            <View style={styles.note}>
                <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.textMuted} />
                <Text style={styles.noteText}>أوقات العمل الرسمية: الأحد – الخميس · ٩:٠٠ ص – ٦:٠٠ م</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { paddingBottom: 48 },

    supportCtaContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    supportCtaBtn: {
        backgroundColor: theme.colors.primaryDark,
        borderRadius: theme.radius.xl,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...theme.shadow.md,
    },
    supportCtaTextWrap: {
        flex: 1,
        alignItems: 'flex-start',
    },
    supportCtaTitle: {
        color: theme.colors.surface,
        fontSize: 16,
        fontFamily: theme.fonts.black,
        marginBottom: 4,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    supportCtaDesc: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        fontFamily: theme.fonts.regular,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    supportCtaIconBox: {
        width: 36,
        height: 36,
        borderRadius: theme.radius.full,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    section: {
        marginHorizontal: 20,
        marginTop: 24,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        color: theme.colors.primaryDark,
        fontFamily: theme.fonts.black,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        marginBottom: 16,
    },

    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    contactIconBox: {
        width: 44,
        height: 44,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    contactInfo: { flex: 1, alignItems: 'flex-start' },
    contactLabel: {
        fontSize: 12,
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.regular,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        marginTop: 4,
    },
    contactValue: {
        fontSize: 15,
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },

    socialRow: {
        flexDirection: 'row',
        gap: 12,
    },
    socialBtn: {
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        paddingVertical: 16,
        alignItems: 'center',
        gap: 8,
    },
    socialLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold,
        textAlign: 'center',
    },

    note: {
        marginHorizontal: 20,
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
    },
    noteText: {
        fontSize: 12,
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
    },
});
