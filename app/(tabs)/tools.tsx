import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';
import { ALL_TOOLS, CATEGORIES } from '@/constants/tools';
import { router } from 'expo-router';
import { useState } from 'react';

export default function ToolsScreen() {
  const [active, setActive] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ALL_TOOLS.filter(t => {
    const matchCat = active === 'all' || t.category === active;
    const matchSearch = search === '' || t.name.includes(search);
    return matchCat && matchSearch;
  });

  const catColors: Record<string, string> = {
    all: theme.colors.primary,
    pdf: '#E53935',
    convert: '#1E88E5',
    ai: '#FB8C00',
    business: '#43A047',
    dev: '#8E24AA',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>جميع الأدوات</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{ALL_TOOLS.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن أداة..."
          placeholderTextColor={theme.colors.textMuted}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ fontSize: 16, color: theme.colors.textMuted, marginLeft: 8 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <View style={styles.catContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map(cat => {
            const isActive = active === cat.id;
            const color = catColors[cat.id] || theme.colors.primary;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isActive && { backgroundColor: color, borderColor: color }]}
                onPress={() => setActive(cat.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Count */}
      <Text style={styles.count}>{filtered.length} أداة</Text>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const color = catColors[item.category] || theme.colors.primary;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/tool/${item.id}`)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingTop: 65, paddingBottom: 14, paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: 26, fontWeight: '900', color: theme.colors.text },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: 12, borderRadius: 50,
    borderWidth: 1, borderColor: theme.colors.border,
    paddingHorizontal: 16, height: 46,
  },
  searchIcon: { fontSize: 16, marginLeft: 6 },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.text },
  catContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  catList: {
    paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  chip: {
    height: 34, paddingHorizontal: 16,
    borderRadius: 50, borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  chipText: { fontSize: 13, fontWeight: '700', color: theme.colors.textMuted },
  chipTextActive: { color: '#fff' },
  count: {
    fontSize: 12, color: theme.colors.textMuted,
    textAlign: 'right', paddingHorizontal: 16, paddingVertical: 6,
  },
  listContent: { padding: 10, paddingBottom: 40 },
  row: { gap: 10, marginBottom: 10 },
  card: {
    flex: 1, backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  iconBox: {
    width: 58, height: 58, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  icon: { fontSize: 28 },
  name: { fontSize: 13, color: theme.colors.text, textAlign: 'center', fontWeight: '700', lineHeight: 18 },
});
