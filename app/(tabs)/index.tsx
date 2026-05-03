import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    I18nManager,
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
import { BrandMark } from '@/components/brand-mark';
import { ScreenBackground } from '@/components/screen-background';
import { SectionHeader } from '@/components/premium-ui';
import { theme } from '@/constants/theme';
import { ALL_TOOLS, HOME_AI_IDS, HOME_PDF_IDS } from '@/constants/tools';

const { width } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_PADDING = 20;
const cardWidth = (width - GRID_PADDING * 2 - GRID_GAP) / 2;

const RTL_ROW: 'row' | 'row-reverse' = I18nManager.isRTL ? 'row' : 'row-reverse';

const QUICK_ACTIONS = [
    {
        id: 'merge',
        label: 'دمج PDF',
        icon: 'set-merge' as const,
    },
    {
        id: 'compress',
        label: 'ضغط PDF',
        icon: 'archive-arrow-down-outline' as const,
    },
    {
        id: 'pdf-to-jpg',
        label: 'تحويل PDF',
        icon: 'file-image-outline' as const,
    },
];

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const quickPDF = ALL_TOOLS.filter((tool) => HOME_PDF_IDS.includes(tool.id));
    const quickAI = ALL_TOOLS.filter((tool) => HOME_AI_IDS.includes(tool.id));
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(14)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 480,
                useNativeDriver: true,
            }),
            Animated.spring(slideUp, {
                toValue: 0,
                useNativeDriver: true,
                speed: 14,
                bounciness: 4,
            }),
        ]).start();
    }, [fadeIn, slideUp]);

    const handlePress = (path: string) => {
        Haptics.selectionAsync();
        router.push(path as never);
    };

    const handleStart = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/tools' as never);
    };

    return (
        <ScreenBackground>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.hero,
                        {
                            paddingTop: Math.max(insets.top, 16) + 16,
                            opacity: fadeIn,
                            transform: [{ translateY: slideUp }],
                        },
                    ]}
                >
                    <BrandMark size={88} glow style={styles.heroLogo} />
                    <Text style={styles.heroEyebrow}>أدوات PDF وذكاء اصطناعي</Text>
                    <Text style={styles.heroTitle}>أنجز مستنداتك باحتراف</Text>
                    <Text style={styles.heroSub}>سرعة، أمان، ونتائج فورية</Text>

                    <PremiumPressable style={styles.cta} onPress={handleStart}>
                        <Text style={styles.ctaText}>ابدأ الآن</Text>
                        <Ionicons
                            name={I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
                            size={18}
                            color={theme.colors.white}
                        />
                    </PremiumPressable>
                </Animated.View>

                <View style={[styles.metaCard, { flexDirection: RTL_ROW }]}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaNum}>{ALL_TOOLS.length}+</Text>
                        <Text style={styles.metaLabel}>أداة</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                        <Ionicons name="shield-checkmark" size={18} color={theme.colors.primary} />
                        <Text style={styles.metaLabel}>تشفير TLS</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                        <Ionicons name="trash-outline" size={18} color={theme.colors.primary} />
                        <Text style={styles.metaLabel}>حذف تلقائي</Text>
                    </View>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.quickChipsScroll}
                    contentContainerStyle={styles.quickChipsRow}
                >
                    {QUICK_ACTIONS.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            style={styles.quickChip}
                            onPress={() => handlePress(`/tool/${action.id}`)}
                            activeOpacity={0.85}
                        >
                            <MaterialCommunityIcons
                                name={action.icon}
                                size={16}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.quickChipLabel}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.sectionSpacer}>
                    <SectionHeader
                        title="الأكثر استخداماً"
                        actionLabel="عرض الكل"
                        onAction={() => handlePress('/tools')}
                    />
                </View>

                <View style={styles.grid}>
                    {quickPDF.map((tool) => (
                        <PremiumPressable
                            key={tool.id}
                            style={styles.toolCard}
                            onPress={() => handlePress(`/tool/${tool.id}`)}
                        >
                            <View style={styles.toolIconBox}>
                                <ToolIcon tool={tool} size={22} />
                            </View>
                            <Text style={styles.toolName} numberOfLines={1}>
                                {tool.name}
                            </Text>
                            <Text style={styles.toolDesc} numberOfLines={2}>
                                {tool.description}
                            </Text>
                        </PremiumPressable>
                    ))}
                </View>

                <View style={styles.sectionSpacer}>
                    <SectionHeader
                        title="المساعد الذكي"
                        actionLabel="عرض الكل"
                        onAction={() => handlePress('/ai')}
                    />
                </View>

                <View style={styles.grid}>
                    {quickAI.map((tool) => (
                        <PremiumPressable
                            key={tool.id}
                            style={[styles.toolCard, styles.aiCard]}
                            onPress={() => handlePress(`/tool/${tool.id}`)}
                        >
                            <View style={[styles.toolIconBox, styles.aiIconBox]}>
                                <ToolIcon tool={tool} size={22} />
                            </View>
                            <Text style={styles.toolName} numberOfLines={1}>
                                {tool.name}
                            </Text>
                            <Text style={styles.toolDesc} numberOfLines={2}>
                                {tool.description}
                            </Text>
                        </PremiumPressable>
                    ))}
                </View>

                <PremiumPressable
                    style={[styles.privacyBanner, { flexDirection: RTL_ROW }]}
                    onPress={() => handlePress('/about')}
                >
                    <View style={styles.privacyIcon}>
                        <Ionicons name="lock-closed" size={18} color={theme.colors.primary} />
                    </View>
                    <View style={styles.privacyText}>
                        <Text style={styles.privacyTitle}>خصوصيتك أولوية</Text>
                        <Text style={styles.privacySub}>
                            معالجة مشفّرة وحذف تلقائي للملفات بعد الانتهاء.
                        </Text>
                    </View>
                </PremiumPressable>
            </ScrollView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 32,
    },

    /* --- Hero (right-aligned) --- */
    hero: {
        alignItems: 'stretch',
        paddingBottom: 28,
        paddingHorizontal: 24,
    },
    heroLogo: {
        alignSelf: I18nManager.isRTL ? 'flex-start' : 'flex-end',
    },
    heroEyebrow: {
        color: theme.colors.primaryLight,
        fontFamily: theme.fonts.bold,
        fontSize: 12,
        letterSpacing: 0.6,
        marginTop: 28,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    heroTitle: {
        color: theme.colors.textOnDark,
        fontFamily: theme.fonts.black,
        fontSize: 32,
        lineHeight: 44,
        marginTop: 10,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    heroSub: {
        color: theme.colors.textOnDarkMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    cta: {
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 10,
        justifyContent: 'center',
        marginTop: 28,
        minHeight: 58,
        paddingVertical: 16,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.40,
        shadowRadius: 22,
        elevation: 8,
    },
    ctaText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 16,
    },

    /* --- Meta strip --- */
    metaCard: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: theme.colors.borderOnDark,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        marginHorizontal: 20,
        marginTop: 4,
        paddingVertical: 14,
    },
    metaItem: {
        alignItems: 'center',
        flex: 1,
        gap: 6,
    },
    metaNum: {
        color: theme.colors.textOnDark,
        fontFamily: theme.fonts.black,
        fontSize: 18,
    },
    metaLabel: {
        color: theme.colors.textOnDarkMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 11,
    },
    metaDivider: {
        backgroundColor: theme.colors.borderOnDark,
        height: 26,
        width: 1,
    },

    /* --- Quick actions (horizontal chips) --- */
    quickChipsScroll: {
        marginTop: 14,
    },
    quickChipsRow: {
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 8,
        paddingHorizontal: 20,
    },
    quickChip: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 6,
        height: 38,
        paddingHorizontal: 14,
    },
    quickChipLabel: {
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        fontSize: 12,
        writingDirection: 'rtl',
    },

    /* --- Sections --- */
    sectionSpacer: {
        marginBottom: 14,
        marginTop: 30,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GRID_GAP,
        paddingHorizontal: GRID_PADDING,
    },
    toolCard: {
        alignItems: 'flex-start',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        minHeight: 132,
        padding: 14,
        width: cardWidth,
    },
    aiCard: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderBrand,
        borderWidth: 1,
    },
    toolIconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.md,
        height: 40,
        justifyContent: 'center',
        marginBottom: 10,
        width: 40,
    },
    aiIconBox: {
        backgroundColor: theme.colors.primarySoft,
    },
    toolName: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 14,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    toolDesc: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
        textAlign: 'right',
        writingDirection: 'rtl',
    },

    /* --- Privacy banner --- */
    privacyBanner: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        gap: 14,
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
    },
    privacyIcon: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.full,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    privacyText: {
        flex: 1,
    },
    privacyTitle: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 13,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    privacySub: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 2,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});
