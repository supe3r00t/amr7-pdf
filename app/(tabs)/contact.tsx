import {
    I18nManager,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { AppHeader, PremiumCard } from '@/components/premium-ui';
import { PremiumPressable } from '@/components/premium-pressable';
import { ScreenBackground } from '@/components/screen-background';

const RTL_ALIGN = I18nManager.isRTL ? 'right' : 'left';

const CONTACTS = [
    {
        id: 'whatsapp',
        label: 'واتساب · فوري',
        value: '0505336956',
        icon: 'whatsapp',
        action: () => Linking.openURL('https://wa.me/966505336956'),
    },
    {
        id: 'unified',
        label: 'الرقم الموحد',
        value: '920017083',
        icon: 'phone-classic',
        action: () => Linking.openURL('tel:920017083'),
    },
    {
        id: 'phone',
        label: 'اتصال مباشر',
        value: '0505336956',
        icon: 'phone-outline',
        action: () => Linking.openURL('tel:0505336956'),
    },
    {
        id: 'email',
        label: 'البريد الإلكتروني',
        value: 'info@amr-7.sa',
        icon: 'email-outline',
        action: () => Linking.openURL('mailto:info@amr-7.sa'),
    },
    {
        id: 'website',
        label: 'الموقع الرسمي',
        value: 'amr-7.sa',
        icon: 'web',
        action: () => Linking.openURL('https://amr-7.sa'),
    },
];

const SOCIAL = [
    {
        id: 'instagram',
        family: 'MaterialCommunityIcons',
        icon: 'instagram',
        url: 'https://www.instagram.com/amr7.sa/',
    },
    {
        id: 'tiktok',
        family: 'FontAwesome5',
        icon: 'tiktok',
        url: 'https://www.tiktok.com/@amr7sa3',
    },
    {
        id: 'linkedin',
        family: 'MaterialCommunityIcons',
        icon: 'linkedin',
        url: 'https://www.linkedin.com/in/ahmed-alammar-5893a121b/',
    },
];

export default function ContactScreen() {
    const insets = useSafeAreaInsets();

    const handleAction = async (action: () => void) => {
        Haptics.selectionAsync();
        await action();
    };

    const openSupportTicket = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/support');
    };

    return (
        <ScreenBackground>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
                showsVerticalScrollIndicator={false}
            >
                <AppHeader
                    eyebrow="مركز المساعدة"
                    title="نحن هنا لمساعدتك"
                    subtitle="اختر القناة الأنسب أو افتح تذكرة دعم."
                    icon="headset"
                />

            <PremiumPressable style={styles.ctaCard} onPress={openSupportTicket}>
                <View style={styles.ctaIcon}>
                    <Ionicons name="ticket-outline" size={20} color={theme.colors.white} />
                </View>
                <View style={styles.ctaText}>
                    <Text style={styles.ctaTitle}>فتح تذكرة دعم</Text>
                    <Text style={styles.ctaSub}>يردّ فريقنا خلال ساعات العمل</Text>
                </View>
                <Ionicons
                    name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={18}
                    color={theme.colors.white}
                />
            </PremiumPressable>

            <PremiumCard style={styles.section}>
                <Text style={styles.sectionTitle}>قنوات التواصل</Text>
                {CONTACTS.map((c, index) => (
                    <TouchableOpacity
                        key={c.id}
                        style={[styles.contactRow, index === CONTACTS.length - 1 && styles.contactRowLast]}
                        onPress={() => handleAction(c.action)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.contactIcon}>
                            <MaterialCommunityIcons name={c.icon as any} size={20} color={theme.colors.primary} />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactValue} numberOfLines={1}>{c.value}</Text>
                            <Text style={styles.contactLabel}>{c.label}</Text>
                        </View>
                        <Ionicons
                            name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                            size={16}
                            color={theme.colors.textMuted}
                        />
                    </TouchableOpacity>
                ))}
            </PremiumCard>

            <PremiumCard style={styles.section}>
                <Text style={styles.sectionTitle}>تابعنا</Text>
                <View style={styles.socialRow}>
                    {SOCIAL.map((s) => (
                        <TouchableOpacity
                            key={s.id}
                            style={styles.socialBtn}
                            onPress={() => handleAction(() => Linking.openURL(s.url))}
                            activeOpacity={0.7}
                        >
                            {s.family === 'FontAwesome5' ? (
                                <FontAwesome5 name={s.icon as any} size={20} color={theme.colors.text} />
                            ) : (
                                <MaterialCommunityIcons name={s.icon as any} size={22} color={theme.colors.text} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </PremiumCard>

                <View style={styles.note}>
                    <Ionicons name="time-outline" size={14} color={theme.colors.textOnDarkMuted} />
                    <Text style={styles.noteText}>الأحد – الخميس · 9:00 ص – 6:00 م</Text>
                </View>
            </ScrollView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    content: { paddingBottom: 32 },

    ctaCard: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 14,
        marginHorizontal: 20,
        marginTop: 8,
        padding: 18,
        ...theme.shadow.md,
    },
    ctaIcon: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: theme.radius.full,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    ctaText: {
        flex: 1,
    },
    ctaTitle: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 15,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    ctaSub: {
        color: 'rgba(255,255,255,0.85)',
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        marginTop: 2,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    section: {
        marginHorizontal: 20,
        marginTop: 16,
        padding: 18,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 15,
        marginBottom: 12,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    contactRow: {
        alignItems: 'center',
        borderBottomColor: theme.colors.borderLight,
        borderBottomWidth: 1,
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 12,
        paddingVertical: 12,
    },
    contactRowLast: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    contactIcon: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.md,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    contactInfo: {
        flex: 1,
    },
    contactValue: {
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        fontSize: 14,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    contactLabel: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 11,
        marginTop: 2,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    socialRow: {
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 10,
    },
    socialBtn: {
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: theme.radius.md,
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },

    note: {
        alignItems: 'center',
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 6,
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 18,
    },
    noteText: {
        color: theme.colors.textOnDarkMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
    },
});
