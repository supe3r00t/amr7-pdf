import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const FEATURES = [
  { icon: 'shield-checkmark-outline', title: 'تشفير متقدم', desc: 'اتصالك وملفاتك مشفّرة بأحدث بروتوكولات TLS/SSL.' },
  { icon: 'trash-outline', title: 'حذف تلقائي', desc: 'لا يتم تخزين ملفاتك بعد انتهاء المعالجة.' },
  { icon: 'flash-outline', title: 'سرعة عملية', desc: 'تنفيذ الأدوات يتم بسرعة ومباشرة من الجوال.' },
  { icon: 'language-outline', title: 'واجهة عربية RTL', desc: 'تجربة عربية كاملة مناسبة للاستخدام اليومي.' },
];

const LINKS = [
  { label: 'الموقع الرسمي', url: 'https://amr-7.sa', icon: 'globe-outline' },
  { label: 'منصة PDF', url: 'https://pdf.amr7.io', icon: 'document-outline' },
  { label: 'تواصل عبر واتساب', url: 'https://wa.me/966505336956', icon: 'logo-whatsapp' },
];

export default function AboutScreen() {
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
        <Text style={styles.tagline}>بيئة رقمية آمنة لإدارة مستندات الأعمال</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { num: '100%', label: 'تشفير' },
          { num: '0', label: 'تخزين ملفات' },
          { num: '29', label: 'أداة فعلية' },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* About Text */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>من نحن</Text>
        <Text style={styles.body}>
          آمر 7 يقدم تجربة جوال عملية للوصول إلى أدوات PDF والذكاء الاصطناعي من بيئة عربية واضحة،
          مع تركيز على السرعة والخصوصية وسهولة الاستخدام.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>رؤيتنا</Text>
        <Text style={styles.body}>
          تقديم أدوات إنتاجية عربية بمظهر احترافي وتجربة مباشرة من الجوال، بدون تعقيد أو عناصر مربكة.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>لماذا آمر 7؟</Text>
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.featureRow}>
            <View style={styles.featureIconBox}>
              <Ionicons name={f.icon as any} size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>روابط مفيدة</Text>
        {LINKS.map((l) => (
          <TouchableOpacity
            key={l.url}
            style={styles.linkRow}
            onPress={() => Linking.openURL(l.url)}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={16} color={theme.colors.textMuted} />
            <Text style={styles.linkText}>{l.label}</Text>
            <View style={styles.linkIconBox}>
              <Ionicons name={l.icon as any} size={18} color={theme.colors.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>AMR-7 PDF Tools · v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 48 },

  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  logo: { width: 140, height: 50, marginBottom: 10 },
  tagline: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },

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
    fontSize: 18,
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

  section: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    textAlign: 'right',
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
    lineHeight: 24,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1, alignItems: 'flex-end' },
  featureTitle: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    textAlign: 'right',
  },
  featureDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
    lineHeight: 20,
    marginTop: 2,
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  linkIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    textAlign: 'right',
  },

  footer: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    marginTop: 24,
  },
});