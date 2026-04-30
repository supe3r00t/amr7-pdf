import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    Linking,
    TouchableOpacity,
    I18nManager,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { AppHeader, PremiumCard } from '@/components/premium-ui';

const FEATURES = [
    { icon: 'shield-lock-outline', title: 'حماية متقدمة للملفات', desc: 'يتم تشفير اتصالك وملفاتك بأحدث بروتوكولات الأمان (TLS/SSL) لضمان سريتها التامة.' },
    { icon: 'trash-can-outline', title: 'حذف تلقائي للمستندات', desc: 'خصوصيتك أولوية. تُحذف جميع ملفاتك نهائياً من خوادمنا فور الانتهاء من معالجتها.' },
    { icon: 'speedometer-medium', title: 'معالجة سريعة وفعّالة', desc: 'بنية تحتية موثوقة تتيح لك إنجاز مهامك ومعالجة ملفاتك في ثوانٍ معدودة، بأعلى جودة ممكنة.' },
    { icon: 'translate', title: 'واجهة عربية متكاملة', desc: 'تجربة مستخدم سلسة وخالية من التعقيد، صُممت خصيصاً لتناسب احتياجات المستخدم العربي.' },
];

const LINKS = [
    { label: 'الموقع الرسمي لآمر 7', url: 'https://amr-7.sa', icon: 'web' },
    { label: 'استخدام المنصة عبر الويب', url: 'https://pdf.amr7.io', icon: 'monitor' },
    { label: 'التواصل مع الدعم الفني للأعمال', url: 'https://wa.me/966505336956', icon: 'whatsapp' },
];

export default function AboutScreen() {
    const insets = useSafeAreaInsets();

    const handleLinkPress = async (url: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await Linking.openURL(url);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 48 }]}
            showsVerticalScrollIndicator={false}
        >
            <AppHeader
                eyebrow="آمر 7 لحلول الأعمال"
                title="منصة PDF عربية آمنة"
                subtitle="أدوات متقدمة لمعالجة ملفات PDF بذكاء وأمان."
                logoSource={require('@/assets/images/logo-new.png')}
            />

            <View style={styles.statsRow}>
                {[
                    { num: '100%', label: 'تشفير آمن' },
                    { num: 'تلقائي', label: 'حذف الملفات' },
                    { num: '+50', label: 'أداة متكاملة' },
                ].map((s) => (
                    <PremiumCard key={s.label} style={styles.statCard}>
                        <Text style={styles.statNum}>{s.num}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                    </PremiumCard>
                ))}
            </View>

            <PremiumCard style={styles.section}>
                <View style={styles.textBlock}>
                    <Text style={styles.sectionTitle}>عن المنصة</Text>
                    <Text style={styles.body}>
                        تقدم منصة <Text style={styles.highlight}>آمر 7</Text> مجموعة متكاملة من الأدوات لمعالجة ملفات PDF وإدارة المستندات بفعالية وسهولة. سواء كنت تحتاج إلى دمج، تقسيم، ضغط، أو تحويل المستندات، نوفر لك حلاً موثوقاً يجمع بين سهولة الاستخدام وتقنيات الذكاء الاصطناعي المتقدمة لتسهيل مهامك اليومية.
                    </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.textBlock}>
                    <Text style={styles.sectionTitle}>رؤيتنا</Text>
                    <Text style={styles.body}>
                        توفير أدوات إنتاجية آمنة وسريعة، تضمن للمستخدم العربي إنجاز مهامه المرتبطة بالمستندات الرقمية بأعلى مستويات الجودة والخصوصية.
                    </Text>
                </View>
            </PremiumCard>

            <PremiumCard style={styles.section}>
                <Text style={styles.sectionTitle}>لماذا تختار آمر 7؟</Text>
                {FEATURES.map((f, index) => (
                    <View key={f.title} style={[styles.featureRow, index === FEATURES.length - 1 && { marginBottom: 0 }]}>
                        <View style={styles.featureIconBox}>
                            <MaterialCommunityIcons name={f.icon as any} size={22} color={theme.colors.primary} />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>{f.title}</Text>
                            <Text style={styles.featureDesc}>{f.desc}</Text>
                        </View>
                    </View>
                ))}
            </PremiumCard>

            <PremiumCard style={styles.section}>
                <Text style={styles.sectionTitle}>روابط هامة</Text>
                {LINKS.map((l, index) => (
                    <TouchableOpacity
                        key={l.url}
                        style={[styles.linkRow, index === LINKS.length - 1 && { borderBottomWidth: 0 }]}
                        onPress={() => handleLinkPress(l.url)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.linkIconBox}>
                            <MaterialCommunityIcons name={l.icon as any} size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.linkText}>{l.label}</Text>
                        <MaterialCommunityIcons
                            name="open-in-new"
                            size={18}
                            color={theme.colors.textMuted}
                            style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
                        />
                    </TouchableOpacity>
                ))}
            </PremiumCard>

            <View style={styles.footer}>
                <Image
                    source={require('@/assets/images/logo-new.png')}
                    style={styles.footerLogo}
                    resizeMode="contain"
                />
                <Text style={styles.footerText}>إصدار المنصة · v1.0.0</Text>
                <Text style={styles.footerCopyright}>جميع الحقوق محفوظة © آمر 7 للحلول الرقمية</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { paddingBottom: 24 },

    statsRow: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        marginTop: -20,
        zIndex: 10,
    },
    statCard: {
        flex: 1,
        borderRadius: theme.radius.md,
        paddingVertical: 16,
        alignItems: 'center',
    },
    statNum: {
        fontSize: 18,
        color: theme.colors.primary,
        fontFamily: theme.fonts.black,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        textAlign: 'center',
        marginTop: 4,
    },

    section: {
        marginHorizontal: 20,
        marginTop: 24,
        padding: 20,
    },
    textBlock: {
        marginBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.borderLight,
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        color: theme.colors.primaryDark,
        fontFamily: theme.fonts.black,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        marginBottom: 12,
    },
    body: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        lineHeight: 24,
    },
    highlight: {
        fontFamily: theme.fonts.bold,
        color: theme.colors.primary,
    },

    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        marginBottom: 20,
    },
    featureIconBox: {
        width: 44,
        height: 44,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primaryLight,
    },
    featureText: { flex: 1, alignItems: 'flex-start' },
    featureTitle: {
        fontSize: 15,
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    featureDesc: {
        fontSize: 13,
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.regular,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        lineHeight: 22,
        marginTop: 4,
    },

    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    linkIconBox: {
        width: 38,
        height: 38,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    linkText: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },

    footer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    footerLogo: {
        width: 100,
        height: 30,
        opacity: 0.5,
        marginBottom: 12,
    },
    footerText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontFamily: theme.fonts.bold,
    },
    footerCopyright: {
        color: theme.colors.textMuted,
        fontSize: 11,
        fontFamily: theme.fonts.regular,
        marginTop: 4,
    },
});
