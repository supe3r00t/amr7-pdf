import { useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    I18nManager,
    Keyboard,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { ALL_TOOLS, CATEGORIES } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';
import { PremiumPressable } from '@/components/premium-pressable';
import { AppHeader } from '@/components/premium-ui';

export default function ToolsScreen() {
    const [active, setActive] = useState<string>('all');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        return ALL_TOOLS.filter((tool) => {
            const matchCategory = active === 'all' || tool.category === active;
            const keyword = search.trim().toLowerCase();
            const matchSearch =
                keyword === '' ||
                tool.name.toLowerCase().includes(keyword) ||
                tool.description.toLowerCase().includes(keyword);
            return matchCategory && matchSearch;
        });
    }, [active, search]);

    const handleCategoryPress = (catId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActive(catId);
    };

    const handleToolPress = (toolId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(`/tool/${toolId}`);
    };

    const clearSearch = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSearch('');
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            <AppHeader
                eyebrow="مكتبة متكاملة لمعالجة الملفات"
                title="مكتبة الأدوات"
                compact
                trailing={
                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>{ALL_TOOLS.length}</Text>
                        <MaterialCommunityIcons name="toolbox-outline" size={16} color={theme.colors.accent} />
                    </View>
                }
            >
                <View style={styles.searchWrap}>
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color={search ? theme.colors.primary : theme.colors.textMuted}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="ابحث عن أداة، دمج، تعديل..."
                        placeholderTextColor={theme.colors.textMuted}
                        value={search}
                        onChangeText={setSearch}
                        textAlign={I18nManager.isRTL ? 'right' : 'left'}
                        returnKeyType="search"
                    />
                    {search !== '' && (
                        <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </AppHeader>

            {/* --- Category Chips --- */}
            <View style={styles.catWrap}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.catList}
                >
                    {CATEGORIES.map((cat) => {
                        const isActive = active === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.chip, isActive && styles.chipActive]}
                                onPress={() => handleCategoryPress(cat.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.resultsHeader}>
                <Text style={styles.countText}>
                    {filtered.length > 0 ? `تم العثور على ${filtered.length} أداة` : 'لا توجد نتائج'}
                </Text>
            </View>

            {/* --- Tools Grid --- */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                numColumns={1}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="file-search-outline" size={64} color={theme.colors.border} />
                        <Text style={styles.emptyTitle}>لم نجد أي أداة تطابق بحثك</Text>
                        <Text style={styles.emptySub}>جرب البحث بكلمات مختلفة مثل دمج أو صور</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <PremiumPressable
                        style={styles.card}
                        onPress={() => handleToolPress(item.id)}
                    >
                        <View style={styles.iconBox}>
                            <ToolIcon tool={item} size={28} />
                            {/* شارة صغيرة للأدوات الذكية */}
                            {item.category === 'ai' && (
                                <View style={styles.aiBadge}>
                                    <Ionicons name="sparkles" size={10} color="#fff" />
                                </View>
                            )}
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.name} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text style={styles.desc} numberOfLines={2}>
                                {item.description}
                            </Text>
                        </View>
                        <Ionicons
                            name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                            size={18}
                            color={theme.colors.textPlaceholder}
                        />
                    </PremiumPressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },

    countBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.10)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.14)',
    },
    countBadgeText: {
        fontSize: 14,
        fontFamily: theme.fonts.black,
        color: theme.colors.heroText,
        marginTop: 2,
    },

    /* --- Search Bar --- */
    searchWrap: {
        backgroundColor: theme.colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.20)',
        paddingHorizontal: 16,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 18,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.text,
        fontFamily: theme.fonts.medium,
    },

    /* --- Categories --- */
    catWrap: {
        marginTop: 16,
        marginBottom: 8,
    },
    catList: {
        paddingHorizontal: 20,
        gap: 10
    },
    chip: {
        height: 40,
        paddingHorizontal: 20,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadow.sm,
    },
    chipActive: {
        backgroundColor: theme.colors.primaryDark,
        borderColor: theme.colors.primaryDark,
    },
    chipText: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        fontFamily: theme.fonts.bold,
    },
    chipTextActive: {
        color: '#fff'
    },

    /* --- Results & Grid --- */
    resultsHeader: {
        paddingHorizontal: 20,
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    countText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        fontFamily: theme.fonts.medium,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },

    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 12,
    },
    card: {
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        borderRadius: 20,
        padding: 16,
        minHeight: 96,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        ...theme.shadow.sm,
    },
    iconBox: {
        width: 52,
        height: 52,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderWidth: 1,
        borderColor: theme.colors.primaryLight,
    },
    aiBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: theme.colors.warning,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    cardText: {
        flex: 1,
        alignItems: 'flex-start',
    },
    name: {
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        color: theme.colors.text,
        fontSize: 15,
        fontFamily: theme.fonts.black,
        marginBottom: 4,
    },
    desc: {
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        color: theme.colors.textMuted,
        fontSize: 13,
        fontFamily: theme.fonts.medium,
        lineHeight: 20,
    },

    /* --- Empty State --- */
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 18,
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        marginTop: 16,
        textAlign: 'center',
    },
    emptySub: {
        fontSize: 14,
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.regular,
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 22,
    },
});
