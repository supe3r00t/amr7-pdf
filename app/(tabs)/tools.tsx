import { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { ALL_TOOLS, CATEGORIES } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';

export default function ToolsScreen() {
  const [active, setActive] = useState<'all' | 'pdf' | 'convert' | 'ai'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchCategory = active === 'all' || tool.category === active;
      const keyword = search.trim();
      const matchSearch =
        keyword === '' || tool.name.includes(keyword) || tool.description.includes(keyword);
      return matchCategory && matchSearch;
    });
  }, [active, search]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.kicker}>{ALL_TOOLS.length} أداة فعلية</Text>
        <Text style={styles.title}>جميع الأدوات</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={19} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن أداة..."
          placeholderTextColor={theme.colors.textMuted}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Chips */}
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
                onPress={() => setActive(cat.id)}
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

      <Text style={styles.count}>{filtered.length} نتيجة</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/tool/${item.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.iconBox}>
              <ToolIcon tool={item} size={26} />
            </View>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'flex-end',
  },
  kicker: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
  },
  title: {
    marginTop: 2,
    fontSize: 26,
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    textAlign: 'right',
  },

  searchWrap: {
    marginTop: 12,
    marginHorizontal: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
  },

  catWrap: { marginTop: 10 },
  catList: { paddingHorizontal: 14, gap: 8 },
  chip: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontFamily: theme.fonts.bold,
  },
  chipTextActive: { color: '#fff' },

  count: {
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 16,
    textAlign: 'right',
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.regular,
  },

  listContent: { paddingHorizontal: 10, paddingBottom: 36, paddingTop: 4 },
  row: { gap: 10, marginBottom: 10 },
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: 16,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    lineHeight: 20,
  },
  desc: {
    marginTop: 4,
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    lineHeight: 18,
  },
});