import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as MailComposer from 'expo-mail-composer';
import { theme } from '@/constants/theme';

const ISSUE_TYPES = ['مشكلة تقنية', 'طلب دعم', 'اقتراح تحسين', 'بلاغ عاجل'];

export default function SupportScreen() {
  const params = useLocalSearchParams<{ tool?: string }>();
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [toolName, setToolName] = useState(params.tool ?? '');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!message.trim()) {
      Alert.alert('تنبيه', 'اكتب تفاصيل المشكلة أو الطلب أولًا');
      return;
    }
    setSending(true);
    const subject = `[AMR7 Support] ${issueType}${toolName ? ` - ${toolName}` : ''}`;
    const body = [
      `نوع الطلب: ${issueType}`,
      `الاسم: ${name || '-'}`,
      `الأداة: ${toolName || '-'}`,
      '',
      'التفاصيل:',
      message,
    ].join('\n');

    try {
      const available = await MailComposer.isAvailableAsync();
      if (available) {
        await MailComposer.composeAsync({ recipients: ['info@amr-7.sa'], subject, body });
        setSending(false);
        return;
      }
    } catch {}

    await Linking.openURL(`mailto:info@amr-7.sa?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setSending(false);
  };

  const sendWhatsApp = async () => {
    const text = [`نوع الطلب: ${issueType}`, `الأداة: ${toolName || '-'}`, `التفاصيل: ${message || '-'}`].join('\n');
    await Linking.openURL(`https://wa.me/966505336956?text=${encodeURIComponent(text)}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>دعم فني</Text>
          <Text style={styles.sub}>ونرد خلال ساعات العمل</Text>
        </View>
      </View>

      {/* Issue Type */}
      <View style={styles.section}>
        <Text style={styles.label}>نوع الطلب</Text>
        <View style={styles.chips}>
          {ISSUE_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, issueType === t && styles.chipActive]}
              onPress={() => setIssueType(t)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, issueType === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Name */}
      <View style={styles.section}>
        <Text style={styles.label}>اسمك (اختياري)</Text>
        <TextInput
          style={styles.input}
          placeholder="اكتب اسمك..."
          placeholderTextColor={theme.colors.textMuted}
          value={name}
          onChangeText={setName}
          textAlign="right"
        />
      </View>

      {/* Tool */}
      <View style={styles.section}>
        <Text style={styles.label}>الأداة المتعلقة (اختياري)</Text>
        <TextInput
          style={styles.input}
          placeholder="اسم الأداة..."
          placeholderTextColor={theme.colors.textMuted}
          value={toolName}
          onChangeText={setToolName}
          textAlign="right"
        />
      </View>

      {/* Message */}
      <View style={styles.section}>
        <Text style={styles.label}>تفاصيل المشكلة أو الطلب *</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="اشرح المشكلة أو الطلب بوضوح..."
          placeholderTextColor={theme.colors.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          textAlign="right"
        />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnEmail} onPress={send} activeOpacity={0.82} disabled={sending}>
          <Ionicons name="mail-outline" size={18} color="#fff" />
          <Text style={styles.btnEmailText}>{sending ? 'جاري الإرسال...' : 'إرسال بريد إلكتروني'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnWA} onPress={sendWhatsApp} activeOpacity={0.82}>
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
          <Text style={styles.btnWAText}>تواصل عبر واتساب</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 48 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerText: { flex: 1, alignItems: 'flex-end' },
  title: { fontSize: 22, color: theme.colors.text, fontFamily: theme.fonts.black, textAlign: 'right' },
  sub: { fontSize: 12, color: theme.colors.textMuted, fontFamily: theme.fonts.regular, textAlign: 'right', marginTop: 2 },

  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    textAlign: 'right',
    marginBottom: 8,
  },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { fontSize: 13, color: theme.colors.textMuted, fontFamily: theme.fonts.bold },
  chipTextActive: { color: '#fff' },

  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
  },
  textarea: { height: 120, paddingTop: 12 },

  actions: { marginHorizontal: 16, marginTop: 24, gap: 10 },
  btnEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 15,
  },
  btnEmailText: { color: '#fff', fontSize: 15, fontFamily: theme.fonts.bold },
  btnWA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EDFBF2',
    borderRadius: theme.radius.full,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#BEF0D4',
  },
  btnWAText: { color: '#1A7A40', fontSize: 15, fontFamily: theme.fonts.bold },
});