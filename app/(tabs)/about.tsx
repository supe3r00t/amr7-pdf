import {
    I18nManager,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { AppHeader, PremiumCard } from '@/components/premium-ui';
import { ScreenBackground } from '@/components/screen-background';

const RTL_ALIGN = I18nManager.isRTL ? 'right' : 'left';

const FEATURES = [
    {
        icon: 'file-document-outline',
        title: 'أدوات موثوقة لإدارة ملفات PDF',
        desc: 'دمج، تقسيم، ضغط، تحويل، وحماية المستندات بسهولة.',
    },
    {
        icon: 'flash-outline',
        title: 'معالجة آمنة وسريعة',
        desc: 'بنية تحتية مشفّرة تنفّذ عملياتك خلال ثوانٍ معدودة.',
    },
    {
        icon: 'account-heart-outline',
        title: 'مصمَّمة للمستخدم العربي',
        desc: 'مصطلحات واضحة ومحتوى احترافي يناسب بيئة الأعمال.',
    },
    {
        icon: 'lifebuoy',
        title: 'دعم مباشر عند الحاجة',
        desc: 'فريق دعم متاح للمساعدة عبر القنوات الرسمية.',
    },
];

const STATS = [
    { num: '50+', label: 'أداة' },
    { num: '100%', label: 'تشفير' },
    { num: 'تلقائي', label: 'حذف' },
];

const LINKS = [
    { label: 'الموقع الرسمي', url: 'https://amr-7.sa', icon: 'web' },
    { label: 'النسخة عبر الويب', url: 'https://pdf.amr7.sa', icon: 'monitor' },
    { label: 'دعم الأعمال (واتساب)', url: 'https://wa.me/966505336956', icon: 'whatsapp' },
];

export default function AboutScreen() {
    const insets = useSafeAreaInsets();

    const handleLinkPress = async (url: string) => {
        Haptics.selectionAsync();
        await Linking.openURL(url);
    };

    return (
        <ScreenBackground>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
                showsVerticalScrollIndicator={false}
            >
                <AppHeader
                    eyebrow="آمر 7"
                    title="منصة عربية لمستنداتك"
                    subtitle="أدوات PDF وذكاء اصطناعي بتجربة احترافية وآمنة."
                    icon="rocket-launch-outline"
                />

                <View style={styles.statsRow}>
                    {STATS.map((s) => (
                        <View key={s.label} style={styles.statCard}>
                            <Text style={styles.statNum}>{s.num}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                <PremiumCard style={styles.section}>
                    <Text style={styles.sectionTitle}>عن المنصة</Text>
                    <Text style={styles.body}>
                        تُقدّم منصة <Text style={styles.highlight}>آمر 7</Text> مجموعة متكاملة من الأدوات لمعالجة
                        ملفات PDF وإدارة المستندات بسهولة وفعالية. سواء احتجت دمج، تقسيم، ضغط، تحويل، أو تحليل
                        بالذكاء الاصطناعي، الأدوات بين يديك بنقرة واحدة.
                    </Text>
                    <View style={styles.divider} />
                    <Text style={styles.sectionTitle}>رؤيتنا</Text>
                    <Text style={styles.body}>
                        نسعى لتمكين المستخدم من إنجاز مهامه على المستندات بأعلى جودة وخصوصية، ضمن تجربة موثوقة
                        وسهلة الاستخدام.
                    </Text>
                </PremiumCard>

                <PremiumCard style={styles.section}>
                    <Text style={styles.sectionTitle}>لماذا آمر 7</Text>
                    {FEATURES.map((f, index) => (
                        <View
                            key={f.title}
                            style={[
                                styles.featureRow,
                                index === FEATURES.length - 1 && styles.featureRowLast,
                            ]}
                        >
                            <View style={styles.featureIconBox}>
                                <MaterialCommunityIcons
                                    name={f.icon as any}
                                    size={20}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>{f.title}</Text>
                                <Text style={styles.featureDesc}>{f.desc}</Text>
                            </View>
                        </View>
                    ))}
                </PremiumCard>

                <PremiumCard style={styles.section}>
                    <Text style={styles.sectionTitle}>روابط مهمة</Text>
                    {LINKS.map((l, index) => (
                        <TouchableOpacity
                            key={l.url}
                            style={[styles.linkRow, index === LINKS.length - 1 && styles.linkRowLast]}
                            onPress={() => handleLinkPress(l.url)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.linkIconBox}>
                                <MaterialCommunityIcons
                                    name={l.icon as any}
                                    size={18}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <Text style={styles.linkText}>{l.label}</Text>
                            <MaterialCommunityIcons
                                name="open-in-new"
                                size={16}
                                color={theme.colors.textMuted}
                            />
                        </TouchableOpacity>
                    ))}
                </PremiumCard>

                <View style={styles.footer}>
                    <Text style={styles.footerVersion}>الإصدار v1.0.0</Text>
                    <Text style={styles.footerCopy}>© آمر 7 للحلول الرقمية</Text>
                </View>
            </ScrollView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    content: { paddingBottom: 24 },

    statsRow: {
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 10,
        marginTop: 8,
        paddingHorizontal: 20,
    },
    statCard: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        flex: 1,
        gap: 4,
        paddingVertical: 16,
    },
    statNum: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 18,
    },
    statLabel: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 11,
    },

    section: {
        marginHorizontal: 20,
        marginTop: 16,
        padding: 20,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 16,
        marginBottom: 10,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    body: {
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        fontSize: 14,
        lineHeight: 24,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    highlight: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
    },
    divider: {
        backgroundColor: theme.colors.borderLight,
        height: 1,
        marginVertical: 18,
    },

    featureRow: {
        alignItems: 'flex-start',
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 14,
        marginBottom: 16,
    },
    featureRowLast: {
        marginBottom: 0,
    },
    featureIconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.md,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 14,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    featureDesc: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 13,
        lineHeight: 20,
        marginTop: 2,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    linkRow: {
        alignItems: 'center',
        borderBottomColor: theme.colors.borderLight,
        borderBottomWidth: 1,
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 12,
        paddingVertical: 14,
    },
    linkRowLast: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    linkIconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.md,
        height: 36,
        justifyContent: 'center',
        width: 36,
    },
    linkText: {
        color: theme.colors.text,
        flex: 1,
        fontFamily: theme.fonts.bold,
        fontSize: 14,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    footer: {
        alignItems: 'center',
        marginTop: 32,
    },
    footerVersion: {
        color: theme.colors.textOnDarkMuted,
        fontFamily: theme.fonts.bold,
        fontSize: 12,
    },
    footerCopy: {
        color: theme.colors.textOnDarkMuted,
        fontFamily: theme.fonts.regular,
        fontSize: 11,
        marginTop: 4,
    },
});
