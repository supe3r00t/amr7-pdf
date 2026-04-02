import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { theme } from '@/constants/theme';
import { AI_TOOLS } from '@/constants/tools';
import { router } from 'expo-router';

export default function AIScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الذكاء الاصطناعي</Text>
        <Text style={styles.sub}>مدعوم بـ Gemini AI</Text>
      </View>

      <FlatList
        data={AI_TOOLS}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/tool/${item.id}`)}
            activeOpacity={0.75}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{getDesc(item.id)}</Text>
            </View>
            <View style={styles.arrow}>
              <Text style={styles.arrowText}>←</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function getDesc(id: string): string {
  const map: Record<string, string> = {
    'ai-chat': 'اسأل أسئلة عن محتوى ملف PDF',
    'ai-summarize': 'احصل على ملخص ذكي للملف',
    'ai-tables': 'استخرج الجداول من PDF',
    'ai-image': 'ولّد صورة بالذكاء الاصطناعي',
    'prompt-gen': 'ولّد برومبت احترافي لأي مهمة',
    'prompt-check': 'افحص وحسّن برومبتك',
    'ai-detector': 'اكشف إذا النص مكتوب بالذكاء الاصطناعي',
    'humanizer': 'حوّل نص الذكاء لنص بشري طبيعي',
  };
  return map[id] || '';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingTop: 65, paddingBottom: 20, paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  title: { fontSize: 26, fontWeight: '900', color: theme.colors.text, textAlign: 'right' },
  sub: { fontSize: 13, color: theme.colors.textMuted, textAlign: 'right', marginTop: 4 },
  list: { padding: 16, gap: 12, paddingBottom: 40 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconBox: {
    width: 54, height: 54, borderRadius: 16,
    backgroundColor: '#FFF8E1',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 14,
  },
  icon: { fontSize: 28 },
  cardText: { flex: 1, alignItems: 'flex-end' },
  name: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  desc: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4, textAlign: 'right' },
  arrow: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 6,
  },
  arrowText: { fontSize: 16, color: theme.colors.primary, fontWeight: '900' },
});
