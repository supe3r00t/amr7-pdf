import { useEffect, useMemo, useRef } from 'react';
import {
    Animated,
    Dimensions,
    I18nManager,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { PremiumPressable } from '@/components/premium-pressable';
import { ToolIcon } from '@/components/tool-icon';
import { BrandMark } from '@/components/brand-mark';
import { SectionHeader } from '@/components/premium-ui';
import { theme } from '@/constants/theme';
import { ALL_TOOLS, HOME_AI_IDS, HOME_PDF_IDS } from '@/constants/tools';

const { width } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_PADDING = 20;
const cardWidth = (width - GRID_PADDING * 2 - GRID_GAP) / 2;

const RTL_ALIGN = I18nManager.isRTL ? 'right' : 'left';

const QUICK_ACTIONS = [
    {
        id: 'merge',
        label: 'دمج PDF',
        sub: 'اجمع الملفات',
        icon: 'set-merge' as const,
    },
    {
        id: 'compress',
        label: 'ضغط PDF',
        sub: 'قلّل الحجم',
        icon: 'archive-arrow-down-outline' as const,
    },
    {
        id: 'pdf-to-jpg',
        label: 'تحويل PDF',
        sub: 'إلى صور',
        icon: 'file-image-outline' as const,
    },
];

function getArabicGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 5) return 'سهرة سعيدة';
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'يوم موفق';
    if (hour < 21) return 'مساء الخير';
    return 'مساء الخير';
}

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const greeting = useMemo(getArabicGreeting, []);
    const quickPDF = ALL_TOOLS.filter((tool) => HOME_PDF_IDS.includes(tool.id));
    const quickAI = ALL_TOOLS.filter((tool) => HOME_AI_IDS.includes(tool.id));
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(14)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 460,
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
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.headerWrap,
                        {
                            paddingTop: Math.max(insets.top, 12) + 8,
                            opacity: fadeIn,
                            transform: [{ translateY: slideUp }],
                        },
                    ]}
                >
                    <View style={styles.headerTop}>
                        <View style={styles.brandRow}>
                            <BrandMark size={48} glow />
                            <View style={styles.brandText}>
                                <Text style={styles.greeting}>{greeting} 👋</Text>
                                <Text style={styles.greetingSub}>أهلاً بك في منصتك الذكية</Text>
                            </View>
                        </View>
                        <PremiumPressable
                            style={styles.helpButton}
                            onPress={() => handlePress('/support')}
                        >
                            <Ionicons name="notifications-outline" size={20} color={theme.colors.text} />
                        </PremiumPressable>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.heroCard, { opacity: fadeIn }]}>
                    <View style={styles.heroAccent} />
                    <View style={styles.heroBadge}>
                        <Ionicons name="sparkles" size={11} color={theme.colors.primaryLight} />
                        <Text style={styles.heroBadgeText}>منصة آمر 7 الذكية</Text>
                    </View>
                    <Text style={styles.heroTitle}>
                        أنجز مهام مستنداتك{'\n'}بسرعة وأمان
                    </Text>
                    <Text style={styles.heroDesc}>
                        أدوات PDF وذكاء اصطناعي بتجربة عربية فاخرة، لمحترفي الأعمال والإنتاجية.
                    </Text>
                    <View style={styles.heroActions}>
                        <PremiumPressable style={styles.ctaPrimary} onPress={handleStart}>
                            <Text style={styles.ctaPrimaryText}>ابدأ الآن</Text>
                            <Ionicons
                                name={I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
                                size={18}
                                color={theme.colors.white}
                            />
                        </PremiumPressable>
                        <PremiumPressable style={styles.ctaGhost} onPress={() => handlePress('/ai')}>
                            <MaterialCommunityIcons
                                name="auto-fix"
                                size={18}
                                color={theme.colors.primaryLight}
                            />
                            <Text style={styles.ctaGhostText}>آمر AI</Text>
                        </PremiumPressable>
                    </View>
                </Animated.View>

                <View style={styles.quickActionsRow}>
                    {QUICK_ACTIONS.map((action) => (
                        <PremiumPressable
                            key={action.id}
                            style={styles.quickAction}
                            onPress={() => handlePress(`/tool/${action.id}`)}
                        >
                            <View style={styles.quickActionIcon}>
                                <MaterialCommunityIcons
                                    name={action.icon}
                                    size={22}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <Text style={styles.quickActionLabel}>{action.label}</Text>
                            <Text style={styles.quickActionSub}>{action.sub}</Text>
                        </PremiumPressable>
                    ))}
                </View>

                <View style={styles.metaCard}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaNum}>{ALL_TOOLS.length}+</Text>
                        <Text style={styles.metaLabel}>أداة</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                        <View style={styles.metaIconRow}>
                            <Ionicons name="shield-checkmark" size={18} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.metaLabel}>تشفير TLS</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                        <View style={styles.metaIconRow}>
                            <Ionicons name="trash-outline" size={18} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.metaLabel}>حذف تلقائي</Text>
                    </View>
                </View>

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
                    style={styles.privacyBanner}
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
                    <Ionicons
                        name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={16}
                        color={theme.colors.textMuted}
                    />
                </PremiumPressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
    },
    content: {
        paddingBottom: 32,
    },

    /* --- Top brand bar --- */
    headerWrap: {
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    headerTop: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    brandRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
    },
    brandText: {
        alignItems: 'flex-start',
    },
    greeting: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 16,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    greetingSub: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        marginTop: 2,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    helpButton: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },

    /* --- Hero card (navy + teal accent) --- */
    heroCard: {
        backgroundColor: theme.colors.brandDeep,
        borderRadius: 22,
        marginHorizontal: 20,
        marginTop: 4,
        overflow: 'hidden',
        padding: 22,
        ...theme.shadow.lg,
    },
    heroAccent: {
        backgroundColor: theme.colors.primary,
        height: 3,
        left: 22,
        position: 'absolute',
        right: 22,
        top: 0,
    },
    heroBadge: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(31, 167, 162, 0.18)',
        borderColor: 'rgba(142, 220, 239, 0.30)',
        borderRadius: theme.radius.full,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 6,
        marginBottom: 14,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    heroBadgeText: {
        color: theme.colors.primaryLight,
        fontFamily: theme.fonts.bold,
        fontSize: 11,
    },
    heroTitle: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 24,
        lineHeight: 34,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    heroDesc: {
        color: 'rgba(232, 236, 239, 0.78)',
        fontFamily: theme.fonts.medium,
        fontSize: 13,
        lineHeight: 22,
        marginTop: 8,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    heroActions: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        gap: 10,
        marginTop: 18,
    },
    ctaPrimary: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        flex: 1.4,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingVertical: 14,
        ...theme.shadow.sm,
    },
    ctaPrimaryText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 14,
    },
    ctaGhost: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.10)',
        borderColor: 'rgba(255, 255, 255, 0.18)',
        borderRadius: theme.radius.md,
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        paddingVertical: 14,
    },
    ctaGhostText: {
        color: theme.colors.primaryLight,
        fontFamily: theme.fonts.bold,
        fontSize: 13,
    },

    /* --- Quick actions --- */
    quickActionsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
        paddingHorizontal: 20,
    },
    quickAction: {
        alignItems: 'flex-start',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        flex: 1,
        gap: 8,
        padding: 14,
    },
    quickActionIcon: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.md,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    quickActionLabel: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 13,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    quickActionSub: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 11,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    /* --- Meta card --- */
    metaCard: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 14,
        paddingVertical: 14,
    },
    metaItem: {
        alignItems: 'center',
        flex: 1,
        gap: 4,
    },
    metaIconRow: {
        alignItems: 'center',
        height: 22,
        justifyContent: 'center',
    },
    metaNum: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 18,
    },
    metaLabel: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 11,
    },
    metaDivider: {
        backgroundColor: theme.colors.borderLight,
        height: 26,
        width: 1,
    },

    /* --- Sections --- */
    sectionSpacer: {
        marginBottom: 12,
        marginTop: 28,
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
        borderWidth: 1,
        minHeight: 130,
        padding: 14,
        width: cardWidth,
    },
    aiCard: {
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.borderBrand,
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
        backgroundColor: theme.colors.surface,
    },
    toolName: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 14,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    toolDesc: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    /* --- Privacy banner --- */
    privacyBanner: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 14,
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
    },
    privacyIcon: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.full,
        height: 36,
        justifyContent: 'center',
        width: 36,
    },
    privacyText: {
        flex: 1,
    },
    privacyTitle: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 13,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    privacySub: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 2,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
});
