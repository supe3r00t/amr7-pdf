import { useEffect, useRef } from 'react';
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
import { SectionHeader } from '@/components/premium-ui';
import { theme } from '@/constants/theme';
import { ALL_TOOLS, HOME_AI_IDS, HOME_PDF_IDS } from '@/constants/tools';

const { width } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_HORIZONTAL_PADDING = 20;
const cardWidth = (width - GRID_HORIZONTAL_PADDING * 2 - GRID_GAP) / 2;

const RTL_ALIGN = I18nManager.isRTL ? 'right' : 'left';

const QUICK_ACTIONS = [
    { id: 'merge', label: 'دمج', icon: 'set-merge' },
    { id: 'compress', label: 'ضغط', icon: 'archive-arrow-down-outline' },
    { id: 'pdf-to-jpg', label: 'تحويل', icon: 'file-image-outline' },
    { id: 'ai-summarize', label: 'تلخيص', icon: 'text-box-search-outline' },
];

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const quickPDF = ALL_TOOLS.filter((tool) => HOME_PDF_IDS.includes(tool.id));
    const quickAI = ALL_TOOLS.filter((tool) => HOME_AI_IDS.includes(tool.id));
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(12)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 420,
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
                            <View style={styles.brandMark}>
                                <Text style={styles.brandMarkText}>7</Text>
                            </View>
                            <View>
                                <Text style={styles.brandTitle}>آمر 7</Text>
                                <Text style={styles.brandSubtitle}>منصة الإنتاجية الذكية</Text>
                            </View>
                        </View>
                        <PremiumPressable
                            style={styles.helpButton}
                            onPress={() => handlePress('/support')}
                        >
                            <Ionicons name="headset-outline" size={20} color={theme.colors.text} />
                        </PremiumPressable>
                    </View>

                    <View style={styles.greeting}>
                        <Text style={styles.greetingHi}>أهلاً بك 👋</Text>
                        <Text style={styles.greetingTitle}>أنجز مهام مستنداتك بسرعة وأمان</Text>
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
                                    name={action.icon as any}
                                    size={22}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <Text style={styles.quickActionLabel}>{action.label}</Text>
                        </PremiumPressable>
                    ))}
                </View>

                <View style={styles.metaCard}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaNum}>{ALL_TOOLS.length}+</Text>
                        <Text style={styles.metaLabel}>أداة متاحة</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                        <Text style={styles.metaNum}>RTL</Text>
                        <Text style={styles.metaLabel}>تجربة عربية</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                        <View style={styles.metaIconRow}>
                            <Ionicons name="shield-checkmark" size={18} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.metaLabel}>معالجة آمنة</Text>
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

    /* --- Header --- */
    headerWrap: {
        paddingHorizontal: 20,
        paddingBottom: 20,
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
    brandMark: {
        alignItems: 'center',
        backgroundColor: theme.colors.primaryDark,
        borderRadius: 12,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    brandMarkText: {
        color: theme.colors.primaryLight,
        fontFamily: theme.fonts.black,
        fontSize: 20,
        marginTop: -2,
    },
    brandTitle: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 17,
        textAlign: RTL_ALIGN,
    },
    brandSubtitle: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 11,
        textAlign: RTL_ALIGN,
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
    greeting: {
        marginTop: 24,
    },
    greetingHi: {
        ...theme.type.title,
        color: theme.colors.textMuted,
        textAlign: RTL_ALIGN,
    },
    greetingTitle: {
        ...theme.type.h1,
        color: theme.colors.text,
        marginTop: 4,
        textAlign: RTL_ALIGN,
    },

    /* --- Quick actions --- */
    quickActionsRow: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 20,
    },
    quickAction: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        flex: 1,
        gap: 8,
        paddingVertical: 14,
    },
    quickActionIcon: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.full,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    quickActionLabel: {
        ...theme.type.captionStrong,
        color: theme.colors.text,
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
        marginTop: 16,
        paddingVertical: 16,
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
        height: 28,
        width: 1,
    },

    /* --- Sections --- */
    sectionSpacer: {
        marginTop: 28,
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GRID_GAP,
        paddingHorizontal: GRID_HORIZONTAL_PADDING,
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
    },
    toolDesc: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
        textAlign: RTL_ALIGN,
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
        marginTop: 28,
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
    },
    privacySub: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 2,
        textAlign: RTL_ALIGN,
    },
});
