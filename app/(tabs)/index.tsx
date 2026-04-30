import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    I18nManager,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { PremiumPressable } from '@/components/premium-pressable';
import { ToolIcon } from '@/components/tool-icon';
import { theme } from '@/constants/theme';
import { ALL_TOOLS, HOME_AI_IDS, HOME_PDF_IDS } from '@/constants/tools';

const { width } = Dimensions.get('window');
const cardWidth = (width - 52) / 2;

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const quickPDF = ALL_TOOLS.filter((tool) => HOME_PDF_IDS.includes(tool.id));
    const quickAI = ALL_TOOLS.filter((tool) => HOME_AI_IDS.includes(tool.id));
    const heroOpacity = useRef(new Animated.Value(0)).current;
    const heroTranslate = useRef(new Animated.Value(18)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(heroOpacity, {
                toValue: 1,
                duration: 520,
                useNativeDriver: true,
            }),
            Animated.spring(heroTranslate, {
                toValue: 0,
                useNativeDriver: true,
                speed: 12,
                bounciness: 5,
            }),
        ]).start();
    }, [heroOpacity, heroTranslate]);

    const handlePress = (path: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(path as never);
    };

    const handleLink = async (url: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await Linking.openURL(url);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 48 }]}
            showsVerticalScrollIndicator={false}
        >
            <Animated.View
                style={[
                    styles.header,
                    {
                        paddingTop: Math.max(insets.top, 20) + 16,
                        opacity: heroOpacity,
                        transform: [{ translateY: heroTranslate }],
                    },
                ]}
            >
                <View style={styles.headerAccent} />

                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/logo-new.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.headerTitles}>
                    <View style={styles.taglineBox}>
                        <MaterialCommunityIcons name="shield-check-outline" size={14} color={theme.colors.accent} />
                        <Text style={styles.tagline}>منصة عربية لأدوات PDF والإنتاجية</Text>
                    </View>
                    <Text style={styles.title}>جميع الأدوات التي تحتاجها{'\n'}في مكان واحد</Text>
                    <Text style={styles.subtitle}>
                        واجهة فاخرة، أدوات عملية، وتجربة آمنة مصممة لتنجز من جوالك بسرعة ووضوح.
                    </Text>
                </View>

                <View style={styles.heroButtons}>
                    <PremiumPressable style={styles.btnPrimary} onPress={() => handlePress('/tools')}>
                        <Text style={styles.btnPrimaryText}>ابدأ الآن</Text>
                        <MaterialCommunityIcons
                            name={I18nManager.isRTL ? 'arrow-left' : 'arrow-right'}
                            size={18}
                            color="#fff"
                        />
                    </PremiumPressable>

                    <PremiumPressable style={styles.btnSecondary} onPress={() => handleLink('https://amr-7.sa')}>
                        <Text style={styles.btnSecondaryText}>حلول المؤسسات</Text>
                        <MaterialCommunityIcons name="domain" size={18} color={theme.colors.heroText} />
                    </PremiumPressable>
                </View>
            </Animated.View>

            <View style={styles.statsRow}>
                {[
                    { num: `${ALL_TOOLS.length}+`, label: 'أداة متاحة', icon: 'toolbox-outline' },
                    { num: 'RTL', label: 'تجربة عربية', icon: 'translate' },
                    { num: 'آمن', label: 'معالجة موثوقة', icon: 'shield-lock-outline' },
                ].map((stat) => (
                    <View key={stat.label} style={styles.statCard}>
                        <MaterialCommunityIcons
                            name={stat.icon as any}
                            size={20}
                            color={theme.colors.primaryLight}
                            style={styles.statIconBg}
                        />
                        <Text style={styles.statNum}>{stat.num}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.banner}>
                <View style={styles.bannerIconBox}>
                    <MaterialCommunityIcons name="shield-check" size={28} color={theme.colors.success} />
                </View>
                <View style={styles.bannerText}>
                    <Text style={styles.bannerTitle}>الخصوصية أولاً: أمان تام لمستنداتك</Text>
                    <Text style={styles.bannerSub}>تتم المعالجة في بيئة مشفرة وتُحذف ملفاتك تلقائياً.</Text>
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>الأكثر استخداماً</Text>
                <TouchableOpacity onPress={() => handlePress('/tools')} activeOpacity={0.7} style={styles.seeAllBtn}>
                    <Text style={styles.seeAll}>عرض الكل</Text>
                    <Ionicons
                        name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={14}
                        color={theme.colors.primary}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {quickPDF.map((tool) => (
                    <PremiumPressable
                        key={tool.id}
                        style={styles.toolCard}
                        onPress={() => handlePress(`/tool/${tool.id}`)}
                    >
                        <View style={styles.toolIconBox}>
                            <ToolIcon tool={tool} size={24} />
                        </View>
                        <Text style={styles.toolName} numberOfLines={2}>
                            {tool.name}
                        </Text>
                        <Text style={styles.toolDesc} numberOfLines={2}>
                            {tool.description}
                        </Text>
                    </PremiumPressable>
                ))}
            </View>

            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>المساعد الذكي (AI)</Text>
                    <Ionicons name="sparkles" size={20} color={theme.colors.warning} />
                </View>
                <TouchableOpacity onPress={() => handlePress('/ai')} activeOpacity={0.7} style={styles.seeAllBtn}>
                    <Text style={styles.seeAll}>عرض الكل</Text>
                    <Ionicons
                        name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={14}
                        color={theme.colors.primary}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {quickAI.map((tool) => (
                    <PremiumPressable
                        key={tool.id}
                        style={[styles.toolCard, styles.aiCard]}
                        onPress={() => handlePress(`/tool/${tool.id}`)}
                    >
                        <View style={[styles.toolIconBox, styles.aiIconBox]}>
                            <ToolIcon tool={tool} size={24} />
                            <View style={styles.aiBadgeSmall}>
                                <Ionicons name="sparkles" size={8} color="#fff" />
                            </View>
                        </View>
                        <Text style={styles.toolName} numberOfLines={2}>
                            {tool.name}
                        </Text>
                        <Text style={styles.toolDesc} numberOfLines={2}>
                            {tool.description}
                        </Text>
                    </PremiumPressable>
                ))}
            </View>

            <TouchableOpacity style={styles.supportBtn} onPress={() => handlePress('/support')} activeOpacity={0.8}>
                <View style={styles.supportBtnContent}>
                    <MaterialCommunityIcons name="headset" size={22} color={theme.colors.text} />
                    <Text style={styles.supportText}>مركز المساعدة والدعم</Text>
                </View>
                <Ionicons
                    name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={18}
                    color={theme.colors.textMuted}
                />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        paddingBottom: 48,
    },
    header: {
        alignItems: 'center',
        backgroundColor: theme.colors.brandDeep,
        borderColor: 'rgba(255,255,255,0.10)',
        borderRadius: 28,
        borderWidth: 1,
        marginHorizontal: 14,
        marginTop: 8,
        overflow: 'hidden',
        paddingBottom: 36,
        paddingHorizontal: 20,
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
    logoContainer: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    logo: {
        width: 178,
        height: 54,
    },
    headerTitles: {
        width: '100%',
        alignItems: 'flex-start',
    },
    taglineBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderRadius: theme.radius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.14)',
        gap: 6,
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagline: {
        color: theme.colors.heroText,
        fontFamily: theme.fonts.bold,
        fontSize: 12,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    title: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 31,
        lineHeight: 39,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    subtitle: {
        color: 'rgba(239,255,253,0.76)',
        fontFamily: theme.fonts.medium,
        fontSize: 15,
        lineHeight: 26,
        marginTop: 12,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    heroButtons: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        gap: 12,
        marginTop: 28,
    },
    btnPrimary: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        gap: 8,
        paddingVertical: 15,
        ...theme.shadow.sm,
    },
    btnPrimaryText: {
        color: '#fff',
        fontFamily: theme.fonts.bold,
        fontSize: 15,
    },
    btnSecondary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderColor: 'rgba(255,255,255,0.20)',
        borderRadius: 16,
        borderWidth: 1,
        gap: 8,
        paddingVertical: 15,
    },
    btnSecondaryText: {
        color: theme.colors.heroText,
        fontFamily: theme.fonts.bold,
        fontSize: 15,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: -16,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: 18,
        borderWidth: 1,
        overflow: 'hidden',
        paddingVertical: 18,
        position: 'relative',
        ...theme.shadow.sm,
    },
    statIconBg: {
        position: 'absolute',
        top: -5,
        right: -5,
        opacity: 0.4,
        transform: [{ scale: 2 }],
    },
    statNum: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 22,
        textAlign: 'center',
    },
    statLabel: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center',
    },
    banner: {
        alignItems: 'center',
        backgroundColor: theme.colors.brandDeep,
        borderColor: 'rgba(31,167,162,0.20)',
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 16,
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
    },
    bannerIconBox: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderRadius: theme.radius.full,
        height: 48,
        justifyContent: 'center',
        width: 48,
        ...theme.shadow.sm,
    },
    bannerText: {
        flex: 1,
        alignItems: 'flex-start',
    },
    bannerTitle: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 14,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    bannerSub: {
        color: 'rgba(239,255,253,0.72)',
        fontFamily: theme.fonts.regular,
        fontSize: 12,
        marginTop: 4,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    sectionHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 32,
        paddingHorizontal: 20,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 18,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    seeAllBtn: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    seeAll: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
        fontSize: 13,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: 20,
    },
    toolCard: {
        alignItems: 'flex-start',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: 22,
        borderWidth: 1,
        justifyContent: 'flex-start',
        minHeight: 154,
        padding: 17,
        width: cardWidth,
        ...theme.shadow.sm,
    },
    aiCard: {
        borderColor: theme.colors.primaryLight,
        backgroundColor: '#FBFEFF',
    },
    toolIconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.primaryLight,
        borderRadius: 15,
        borderWidth: 1,
        height: 52,
        justifyContent: 'center',
        marginBottom: 12,
        position: 'relative',
        width: 52,
    },
    aiIconBox: {
        backgroundColor: theme.colors.primarySoft,
        borderColor: 'transparent',
    },
    aiBadgeSmall: {
        position: 'absolute',
        top: -6,
        right: -6,
        alignItems: 'center',
        backgroundColor: theme.colors.warning,
        borderColor: theme.colors.surface,
        borderRadius: 8,
        borderWidth: 2,
        height: 16,
        justifyContent: 'center',
        width: 16,
    },
    toolName: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 14,
        lineHeight: 20,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    toolDesc: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 5,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    supportBtn: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 32,
        padding: 18,
        ...theme.shadow.sm,
    },
    supportBtnContent: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
    },
    supportText: {
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        fontSize: 15,
    },
});
