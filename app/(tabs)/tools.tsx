import { useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    I18nManager,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { ALL_TOOLS, CATEGORIES } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';
import { PremiumPressable } from '@/components/premium-pressable';
import { AppHeader, Chip } from '@/components/premium-ui';

const { width } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_PADDING = 20;
const cardWidth = (width - GRID_PADDING * 2 - GRID_GAP) / 2;
const RTL_ALIGN = I18nManager.isRTL ? 'right' : 'left';

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
        Haptics.selectionAsync();
        setActive(catId);
    };

    const handleToolPress = (toolId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/tool/${toolId}`);
    };

    const clearSearch = () => {
        Haptics.selectionAsync();
        setSearch('');
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            <AppHeader
                eyebrow="مكتبة الأدوات"
                title="كل أدواتك في مكان واحد"
                subtitle="ابحث، فلتر، وافتح الأداة بنقرة واحدة."
            />

            <View style={styles.searchWrap}>
                <Ionicons
                    name="search-outline"
                    size={20}
                    color={search ? theme.colors.primary : theme.colors.textMuted}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="ابحث عن أداة..."
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={search}
                    onChangeText={setSearch}
                    textAlign={RTL_ALIGN}
                    returnKeyType="search"
                />
                {search !== '' && (
                    <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.catWrap}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.catList}
                >
                    {CATEGORIES.map((cat) => (
                        <Chip
                            key={cat.id}
                            label={cat.name}
                            active={active === cat.id}
                            onPress={() => handleCategoryPress(cat.id)}
                        />
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                ListHeaderComponent={
                    <View style={styles.resultsHeader}>
                        <Text style={styles.countText}>
                            {filtered.length > 0 ? `${filtered.length} أداة` : 'لا توجد نتائج'}
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <MaterialCommunityIcons
                                name="file-search-outline"
                                size={40}
                                color={theme.colors.textMuted}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>لم نجد ما تبحث عنه</Text>
                        <Text style={styles.emptySub}>جرّب كلمات مختلفة أو فئة أخرى.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <PremiumPressable
                        style={[styles.card, { width: cardWidth }]}
                        onPress={() => handleToolPress(item.id)}
                    >
                        <View style={styles.cardTop}>
                            <View style={styles.iconBox}>
                                <ToolIcon tool={item} size={20} />
                            </View>
                            {item.category === 'ai' && (
                                <View style={styles.aiPill}>
                                    <Ionicons name="sparkles" size={9} color={theme.colors.primary} />
                                    <Text style={styles.aiPillText}>AI</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.name} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text style={styles.desc} numberOfLines={2}>
                            {item.description}
                        </Text>
                    </PremiumPressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: theme.colors.background, flex: 1 },

    searchWrap: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
        height: 48,
        marginHorizontal: 20,
        marginTop: 8,
        paddingHorizontal: 14,
    },
    searchInput: {
        color: theme.colors.text,
        flex: 1,
        fontFamily: theme.fonts.medium,
        fontSize: 14,
    },

    catWrap: {
        marginTop: 14,
    },
    catList: {
        gap: 8,
        paddingHorizontal: 20,
    },

    resultsHeader: {
        marginBottom: 12,
        marginTop: 18,
    },
    countText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.bold,
        fontSize: 12,
        textAlign: RTL_ALIGN,
    },

    listContent: {
        paddingBottom: 40,
        paddingHorizontal: GRID_PADDING,
    },
    row: {
        gap: GRID_GAP,
        marginBottom: GRID_GAP,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        minHeight: 132,
        padding: 14,
    },
    cardTop: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    iconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.md,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    aiPill: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.full,
        flexDirection: 'row',
        gap: 3,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    aiPillText: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.black,
        fontSize: 10,
    },
    name: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 14,
        marginBottom: 4,
        textAlign: RTL_ALIGN,
    },
    desc: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 12,
        lineHeight: 18,
        textAlign: RTL_ALIGN,
    },

    emptyState: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        height: 72,
        justifyContent: 'center',
        marginBottom: 16,
        width: 72,
    },
    emptyTitle: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 16,
        textAlign: 'center',
    },
    emptySub: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
        fontSize: 13,
        marginTop: 6,
        textAlign: 'center',
    },
});
