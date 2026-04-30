import { View, Text, FlatList, StyleSheet, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { AI_TOOLS } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';
import { AppHeader, PremiumCard } from '@/components/premium-ui';
import { PremiumPressable } from '@/components/premium-pressable';

export default function AIScreen() {
    const handleToolPress = (id: string) => {
        // اهتزاز متوسط يعطي إحساساً بـ "تشغيل محرك الذكاء الاصطناعي"
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(`/tool/${id}`);
    };

    return (
        <View style={styles.container}>
            <AppHeader
                eyebrow="بنية تحليل متقدمة بـ Google Gemini™"
                title="مساحة آمر AI"
                subtitle="أدوات ذكية لتحليل المستندات والنصوص بواجهة عربية واضحة."
                icon="robot-outline"
                compact
            />

            {/* Premium Info Banner */}
            <PremiumCard style={styles.infoBanner}>
                <View style={styles.iconBoxInfo}>
                    <Ionicons name="sparkles" size={18} color={theme.colors.surface} />
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitle}>ارتقِ بإنتاجيتك الذكية</Text>
                    <Text style={styles.infoText}>
                        مجموعة أدوات احترافية مصممة لتحليل، تلخيص، ومعالجة مستنداتك ونصوصك بذكاء فائق وفي ثوانٍ معدودة.
                    </Text>
                </View>
            </PremiumCard>

            {/* AI Tools List */}
            <FlatList
                data={AI_TOOLS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <PremiumPressable
                        style={styles.card}
                        onPress={() => handleToolPress(item.id)}
                    >
                        {/* Premium Icon Box */}
                        <View style={styles.iconBox}>
                            <ToolIcon tool={item} size={26} />
                            {/* شارة صغيرة توحي بالذكاء */}
                            <View style={styles.aiBadge}>
                                <Ionicons name="sparkles" size={10} color={theme.colors.surface} />
                            </View>
                        </View>

                        {/* Text Content */}
                        <View style={styles.textWrap}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                        </View>

                        {/* Smart RTL Arrow */}
                        <View style={styles.arrowBox}>
                            <Ionicons
                                name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                                size={20}
                                color={theme.colors.textMuted}
                            />
                        </View>
                    </PremiumPressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },

    infoBanner: {
        marginHorizontal: 20,
        marginTop: 24,
        backgroundColor: theme.colors.primaryDark,
        borderColor: 'rgba(31,167,162,0.18)',
        borderRadius: theme.radius.xl,
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
    },
    iconBoxInfo: {
        width: 38,
        height: 38,
        borderRadius: theme.radius.md,
        backgroundColor: 'rgba(255,255,255,0.2)', // شفافية زجاجية أنيقة
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 15,
        color: theme.colors.surface,
        fontFamily: theme.fonts.black,
        marginBottom: 4,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    infoText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        fontFamily: theme.fonts.regular,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        lineHeight: 20,
    },

    list: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
        gap: 16
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        ...theme.shadow.sm,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primaryLight,
        position: 'relative',
    },
    aiBadge: {
        position: 'absolute',
        top: -4,
        right: -4, // سيتم عكسها تلقائياً إذا كان الـ Layout RTL
        backgroundColor: theme.colors.primary,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    textWrap: {
        flex: 1,
        alignItems: 'flex-start',
    },
    name: {
        color: theme.colors.text,
        fontSize: 16,
        fontFamily: theme.fonts.black,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        marginBottom: 4,
    },
    desc: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        fontFamily: theme.fonts.regular,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        lineHeight: 20,
    },
    arrowBox: {
        width: 32,
        height: 32,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
