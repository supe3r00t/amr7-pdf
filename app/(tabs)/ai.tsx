import { FlatList, I18nManager, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { AI_TOOLS } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';
import { AppHeader } from '@/components/premium-ui';
import { PremiumPressable } from '@/components/premium-pressable';

const RTL_ALIGN = I18nManager.isRTL ? 'right' : 'left';

export default function AIScreen() {
    const handleToolPress = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/tool/${id}`);
    };

    return (
        <View style={styles.container}>
            <AppHeader
                eyebrow="آمر AI"
                title="أدوات ذكاء اصطناعي"
                subtitle="حلّل، لخّص، وأعد صياغة المستندات والنصوص بدقّة عربية."
                icon="auto-fix"
            />

            <View style={styles.banner}>
                <View style={styles.bannerIcon}>
                    <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
                </View>
                <Text style={styles.bannerText}>
                    مدعوم بأحدث تقنيات الذكاء الاصطناعي · استجابة في ثوانٍ
                </Text>
            </View>

            <FlatList
                data={AI_TOOLS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                    <PremiumPressable
                        style={styles.card}
                        onPress={() => handleToolPress(item.id)}
                    >
                        <View style={styles.iconBox}>
                            <ToolIcon tool={item} size={22} />
                        </View>

                        <View style={styles.textWrap}>
                            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                        </View>

                        <Ionicons
                            name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                            size={18}
                            color={theme.colors.textMuted}
                        />
                    </PremiumPressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: theme.colors.background, flex: 1 },

    banner: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.borderBrand,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
        marginHorizontal: 20,
        marginTop: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    bannerIcon: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.full,
        height: 28,
        justifyContent: 'center',
        width: 28,
    },
    bannerText: {
        color: theme.colors.text,
        flex: 1,
        fontFamily: theme.fonts.bold,
        fontSize: 12,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },

    list: {
        paddingBottom: 40,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    separator: {
        height: 10,
    },
    card: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 14,
        padding: 14,
    },
    iconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.md,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    textWrap: {
        flex: 1,
    },
    name: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 14,
        marginBottom: 2,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    desc: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        lineHeight: 18,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
});
