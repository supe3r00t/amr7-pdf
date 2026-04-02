import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { theme } from '@/constants/theme';
import { ALL_TOOLS } from '@/constants/tools';
import { router } from 'expo-router';

const QUICK_TOOLS = ['merge', 'split', 'compress', 'rotate', 'protect', 'ocr'];
const QUICK_AI = ['ai-chat', 'ai-summarize', 'ai-detector', 'humanizer'];

export default function HomeScreen() {
  const quickPDF = ALL_TOOLS.filter(t => QUICK_TOOLS.includes(t.id));
  const quickAI = ALL_TOOLS.filter(t => QUICK_AI.includes(t.id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tagline}>أدوات PDF والذكاء الاصطناعي</Text>
        <TouchableOpacity style={styles.businessBtn} onPress={() => Linking.openURL('https://amr-7.sa')}>
          <Text style={styles.businessBtnText}>خدمات الأعمال ←</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{ALL_TOOLS.length}+</Text>
          <Text style={styles.statLabel}>أداة ذكية</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>100%</Text>
          <Text style={styles.statLabel}>مجاناً</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>تخزين ملفات</Text>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>بيئة رقمية آمنة 🔒</Text>
        <Text style={styles.bannerSub}>ملفاتك تُحذف تلقائياً بعد المعالجة</Text>
      </View>

      {/* PDF Tools */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={() => router.push('/tools')}>
          <Text style={styles.seeAll}>عرض الكل</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>أدوات PDF</Text>
      </View>
      <View style={styles.grid}>
        {quickPDF.map(tool => (
          <TouchableOpacity key={tool.id} style={styles.toolCard} onPress={() => router.push(`/tool/${tool.id}`)} activeOpacity={0.7}>
            <View style={styles.toolIconBox}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
            </View>
            <Text style={styles.toolName} numberOfLines={2}>{tool.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Tools */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={() => router.push('/ai')}>
          <Text style={styles.seeAll}>عرض الكل</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>🤖 الذكاء الاصطناعي</Text>
      </View>
      <View style={styles.grid}>
        {quickAI.map(tool => (
          <TouchableOpacity key={tool.id} style={[styles.toolCard, styles.aiCard]} onPress={() => router.push(`/tool/${tool.id}`)} activeOpacity={0.7}>
            <View style={styles.aiIconBox}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
            </View>
            <Text style={styles.toolName} numberOfLines={2}>{tool.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categories Banner */}
      <Text style={styles.sectionTitle2}>تصفح حسب القسم</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
        {[
          { label: 'مستندات PDF', emoji: '📄', cat: 'pdf' },
          { label: 'تحويل الملفات', emoji: '🔄', cat: 'convert' },
          { label: 'أعمال وإدارة', emoji: '💼', cat: 'business' },
          { label: 'أدوات المطورين', emoji: '💻', cat: 'dev' },
        ].map(item => (
          <TouchableOpacity key={item.cat} style={styles.catCard} onPress={() => router.push('/tools')}>
            <Text style={styles.catEmoji}>{item.emoji}</Text>
            <Text style={styles.catLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    alignItems: 'center', paddingTop: 65, paddingBottom: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  logo: { width: 160, height: 56 },
  tagline: { fontSize: 13, color: theme.colors.textMuted, marginTop: 6 },
  businessBtn: {
    marginTop: 12, backgroundColor: theme.colors.primary,
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 50,
  },
  businessBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  statsRow: { flexDirection: 'row', padding: 16, gap: 10 },
  statCard: {
    flex: 1, backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  statNum: { fontSize: 22, fontWeight: '900', color: theme.colors.primary },
  statLabel: { fontSize: 10, color: theme.colors.textMuted, marginTop: 3, textAlign: 'center' },
  banner: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: theme.colors.primary + '15',
    borderRadius: theme.radius.lg, padding: 14,
    borderWidth: 1, borderColor: theme.colors.primary + '30',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  bannerTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.primary },
  bannerSub: { fontSize: 11, color: theme.colors.textMuted },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginTop: 16, marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.text },
  sectionTitle2: { fontSize: 17, fontWeight: '800', color: theme.colors.text, paddingHorizontal: 16, marginTop: 16, marginBottom: 10, textAlign: 'right' },
  seeAll: { fontSize: 13, color: theme.colors.primary, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  toolCard: {
    width: '30%', backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  aiCard: { borderColor: theme.colors.primary + '30', backgroundColor: '#F0FAF9' },
  toolIconBox: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  aiIconBox: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: '#E0F2F1',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  toolIcon: { fontSize: 24 },
  toolName: { fontSize: 11, color: theme.colors.text, textAlign: 'center', fontWeight: '700', lineHeight: 16 },
  catCard: {
    backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg,
    padding: 16, alignItems: 'center', minWidth: 110,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  catEmoji: { fontSize: 28, marginBottom: 6 },
  catLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
});
