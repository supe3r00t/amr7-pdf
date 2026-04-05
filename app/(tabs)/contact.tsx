import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const CONTACTS = [
  {
    id: 'whatsapp',
    label: 'واتساب',
    value: '0505336956',
    icon: 'logo-whatsapp',
    color: '#25D366',
    bg: '#EDFBF2',
    action: () => Linking.openURL('https://wa.me/966505336956'),
  },
  {
    id: 'phone',
    label: 'هاتف',
    value: '0505336956',
    icon: 'call-outline',
    color: theme.colors.primary,
    bg: theme.colors.primarySoft,
    action: () => Linking.openURL('tel:0505336956'),
  },
  {
    id: 'email',
    label: 'البريد الإلكتروني',
    value: 'info@amr-7.sa',
    icon: 'mail-outline',
    color: '#EA4335',
    bg: '#FEF0EE',
    action: () => Linking.openURL('mailto:info@amr-7.sa'),
  },
  {
    id: 'website',
    label: 'الموقع الرسمي',
    value: 'amr-7.sa',
    icon: 'globe-outline',
    color: theme.colors.primaryDark,
    bg: '#EFF4FA',
    action: () => Linking.openURL('https://amr-7.sa'),
  },
];

const SOCIAL = [
  { id: 'twitter', label: 'تويتر / X', icon: 'logo-twitter', color: '#1DA1F2', url: 'https://x.com/amr7sa' },
  { id: 'instagram', label: 'إنستغرام', icon: 'logo-instagram', color: '#E4405F', url: 'https://instagram.com/amr7sa' },
  { id: 'linkedin', label: 'لينكد إن', icon: 'logo-linkedin', color: '#0A66C2', url: 'https://linkedin.com/company/amr7sa' },
];

export default function ContactScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.kicker}>نرد خلال ساعات العمل</Text>
        <Text style={styles.title}>تواصل معنا</Text>
      </View>

      {/* Contact Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>قنوات التواصل</Text>
        {CONTACTS.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.contactCard}
            onPress={c.action}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={16} color={theme.colors.textMuted} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactValue}>{c.value}</Text>
              <Text style={styles.contactLabel}>{c.label}</Text>
            </View>
            <View style={[styles.contactIconBox, { backgroundColor: c.bg }]}>
              <Ionicons name={c.icon as any} size={22} color={c.color} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Social */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>حسابات التواصل الاجتماعي</Text>
        <View style={styles.socialRow}>
          {SOCIAL.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.socialBtn}
              onPress={() => Linking.openURL(s.url)}
              activeOpacity={0.8}
            >
              <Ionicons name={s.icon as any} size={22} color={s.color} />
              <Text style={styles.socialLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Support Note */}
      <View style={styles.note}>
        <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.textMuted} />
        <Text style={styles.noteText}>أوقات الدعم: الأحد – الخميس · ٩ص – ٦م</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 48 },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
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

  section: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    textAlign: 'right',
    marginBottom: 12,
  },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  contactIconBox: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactInfo: { flex: 1, alignItems: 'flex-end' },
  contactLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
  },
  contactValue: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    textAlign: 'right',
  },

  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  socialLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },

  note: {
    marginHorizontal: 16,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  noteText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
  },
});