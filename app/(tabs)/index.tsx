import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { ALL_TOOLS, HOME_AI_IDS, HOME_PDF_IDS } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';

export default function HomeScreen() {
  const quickPDF = ALL_TOOLS.filter((t) => HOME_PDF_IDS.includes(t.id));
  const quickAI = ALL_TOOLS.filter((t) => HOME_AI_IDS.includes(t.id));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>منصة إنتاجية عربية · PDF وذكاء اصطناعي</Text>
        <Text style={styles.title}>أدوات جوال{'\n'}بدون تعقيد</Text>

        <View style={styles.heroButtons}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push('/tools')}
            activeOpacity={0.82}
          >
            <Ionicons name="grid-outline" size={18} color="#fff" style={{ marginLeft: 6 }} />
            <Text style={styles.btnPrimaryText}>ابدأ بالأدوات</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => Linking.openURL('https://amr-7.sa')}
            activeOpacity={0.82}
          >
            <Ionicons name="open-outline" size={16} color={theme.colors.primary} style={{ marginLeft: 6 }} />
            <Text style={styles.btnSecondaryText}>خدمات الأعمال</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { num: `${ALL_TOOLS.length}`, label: 'أداة فعلية' },
          { num: '0', label: 'تخزين ملفات' },
          { num: '100%', label: 'مشفّر' },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Privacy Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerIcon}>
          <MaterialCommunityIcons name="shield-check" size={26} color={theme.colors.primary} />
        </View>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>بيئة معالجة آمنة</Text>
          <Text style={styles.bannerSub}>ملفاتك لا تُخزن بعد تنفيذ الأداة</Text>
        </View>
      </View>

      {/* PDF Section */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={() => router.push('/tools')} activeOpacity={0.8}>
          <Text style={styles.seeAll}>عرض الكل</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>أدوات PDF</Text>
      </View>

      <View style={styles.grid}>
        {quickPDF.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolCard}
            onPress={() => router.push(`/tool/${tool.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.toolIconBox}>
              <ToolIcon tool={tool} size={26} />
            </View>
            <Text style={styles.toolName} numberOfLines={2}>
              {tool.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Section */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={() => router.push('/ai')} activeOpacity={0.8}>
          <Text style={styles.seeAll}>عرض الكل</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>الذكاء الاصطناعي</Text>
      </View>

      <View style={styles.grid}>
        {quickAI.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolCard, styles.aiCard]}
            onPress={() => router.push(`/tool/${tool.id}`)}
            activeOpacity={0.8}
          >
            <View style={[styles.toolIconBox, styles.aiIconBox]}>
              <ToolIcon tool={tool} size={26} />
            </View>
            <Text style={styles.toolName} numberOfLines={2}>
              {tool.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Support Button */}
      <TouchableOpacity
        style={styles.supportBtn}
        onPress={() => router.push('/support')}
        activeOpacity={0.82}
      >
        <MaterialCommunityIcons name="lifebuoy" size={20} color={theme.colors.primary} style={{ marginLeft: 8 }} />
        <Text style={styles.supportText}>دعم فني ورفع شكوى</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 48 },

  // Header
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'flex-end',
  },
  logo: { width: 140, height: 50, marginBottom: 10, alignSelf: 'center' },
  tagline: {
    fontSize: 12,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    textAlign: 'right',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 30,
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    textAlign: 'right',
    lineHeight: 40,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 13,
    paddingHorizontal: 22,
    flex: 1,
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: theme.fonts.bold,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.full,
    paddingVertical: 13,
    paddingHorizontal: 18,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${theme.colors.primary}30`,
  },
  btnSecondaryText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontFamily: theme.fonts.bold,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statNum: {
    fontSize: 19,
    color: theme.colors.primary,
    fontFamily: theme.fonts.black,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    marginTop: 3,
  },

  // Banner
  banner: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}25`,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bannerIcon: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${theme.colors.primary}20`,
  },
  bannerText: { flex: 1, alignItems: 'flex-end' },
  bannerTitle: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    textAlign: 'right',
  },
  bannerSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
    marginTop: 3,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    textAlign: 'right',
  },
  seeAll: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  toolCard: {
    width: '30.5%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    minHeight: 120,
    justifyContent: 'center',
  },
  aiCard: {
    backgroundColor: '#F2FAF8',
    borderColor: `${theme.colors.primary}30`,
  },
  toolIconBox: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  aiIconBox: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  toolName: {
    fontSize: 12,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Support
  supportBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportText: {
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: theme.fonts.bold,
  },
});