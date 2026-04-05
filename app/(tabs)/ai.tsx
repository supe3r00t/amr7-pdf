import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { AI_TOOLS } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';

export default function AIScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.kicker}>مدعوم بـ Google Gemini</Text>
        <Text style={styles.title}>الذكاء الاصطناعي</Text>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={18} color={theme.colors.primary} />
        <Text style={styles.infoText}>
          أدوات الذكاء الاصطناعي تعمل على النصوص والملفات مباشرة
        </Text>
      </View>

      <FlatList
        data={AI_TOOLS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/tool/${item.id}`)}
            activeOpacity={0.8}
          >
            {/* Icon - right side */}
            <View style={styles.iconBox}>
              <ToolIcon tool={item} size={26} />
            </View>

            {/* Text - middle */}
            <View style={styles.textWrap}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
            </View>

            {/* Arrow - left side */}
            <Ionicons name="chevron-back" size={18} color={theme.colors.textMuted} />
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
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },
  title: {
    marginTop: 2,
    fontSize: 26,
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    textAlign: 'right',
  },

  infoBanner: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}25`,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
    lineHeight: 20,
  },

  list: { padding: 14, gap: 10, paddingBottom: 40 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: theme.radius.md,
    backgroundColor: `${theme.colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    width: '100%',
    textAlign: 'right',
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  desc: {
    width: '100%',
    marginTop: 3,
    textAlign: 'right',
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    lineHeight: 20,
  },
});