import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { theme } from '@/constants/theme';
import { getToolById } from '@/constants/tools';
import { ToolIcon } from '@/components/tool-icon';

const API_BASE = 'https://pdf.amr7.io/api';

const API_MAP: Record<string, string> = {
  // PDF
  merge:              'merge-pdf',
  split:              'split-pdf',
  compress:           'compress-pdf',
  rotate:             'rotate-pdf',
  'extract-pages':    'extract-pages',
  'delete-pages':     'delete-pages',
  organize:           'organize-pdf',
  crop:               'crop-pdf',
  resize:             'resize-pdf',
  'add-page-numbers': 'add-page-numbers',
  'header-footer':    'header-footer-pdf',
  watermark:          'watermark-pdf',
  protect:            'protect-pdf',
  unlock:             'unlock-pdf',
  'edit-metadata':    'edit-pdf-metadata',
  flatten:            'flatten-pdf',
  repair:             'repair-pdf',
  grayscale:          'grayscale-pdf',
  'extract-images':   'extract-images',
  ocr:                'ocr-pdf',
  // تحويل
  'pdf-to-jpg':       'pdf-to-jpg',
  'jpg-to-pdf':       'jpg-to-pdf',
  'word-to-pdf':      'word-to-pdf',
  'excel-to-pdf':     'excel-to-pdf',
  // AI
  'ai-chat':          'ai/chat-pdf',
  'ai-summarize':     'ai/summarize',
  'ai-tables':        'ai/extract-tables',
  'ai-image-gen':     'ai/image-gen',
  'prompt-gen':       'ai/prompt-generator',
  'prompt-check':     'ai/prompt-checker',
  'ai-detector':      'ai/detector',
  humanizer:          'ai/humanizer',
  // أعمال
  'qr-code':          'tools/qr-code',
  barcode:            'tools/barcode',
  invoice:            'tools/invoice',
  'whatsapp-link':    'tools/whatsapp-link',
  'email-signature':  'tools/email-signature',
  // نصوص
  'text-tools':       'tools/text-tools',
  calculators:        'tools/calculators',
  // تصميم
  'color-tools':      'tools/color-tools',
  'image-tools':      'tools/image-tools',
  // مطورين
  'dev-tools':        'tools/dev-tools',
};

const MULTI_FILE_TOOLS   = ['merge', 'jpg-to-pdf'];
const TEXT_RESULT_TOOLS  = ['ocr', 'ai-chat', 'ai-summarize', 'ai-tables', 'prompt-gen', 'prompt-check', 'ai-detector', 'humanizer', 'text-tools', 'calculators', 'color-tools', 'dev-tools', 'whatsapp-link', 'email-signature', 'qr-code', 'barcode', 'invoice'];
const WORD_TOOLS         = ['word-to-pdf'];
const EXCEL_TOOLS        = ['excel-to-pdf'];
const IMAGE_RESULT_TOOLS = ['ai-image-gen', 'image-tools'];
const NO_FILE_TOOLS      = ['prompt-gen', 'prompt-check', 'humanizer', 'ai-detector', 'qr-code', 'barcode', 'invoice', 'whatsapp-link', 'email-signature', 'text-tools', 'calculators', 'color-tools', 'dev-tools'];

type ToolOptions = Record<string, string>;

const TOOL_OPTIONS: Record<string, { label: string; key: string; placeholder: string; multiline?: boolean }[]> = {
  split:             [{ label: 'أرقام الصفحات', key: 'pages', placeholder: '1,3,5' }],
  'extract-pages':   [{ label: 'الصفحات المطلوبة', key: 'pages', placeholder: '1-3' }],
  'delete-pages':    [{ label: 'الصفحات للحذف', key: 'pages', placeholder: '2,4' }],
  protect:           [{ label: 'كلمة المرور', key: 'password', placeholder: 'أدخل كلمة المرور' }],
  unlock:            [{ label: 'كلمة المرور الحالية', key: 'password', placeholder: 'أدخل كلمة المرور' }],
  watermark:         [{ label: 'نص العلامة المائية', key: 'text', placeholder: 'سري | نسخة تجريبية' }],
  'edit-metadata':   [
    { label: 'عنوان الملف', key: 'title', placeholder: 'اسم المستند' },
    { label: 'اسم المؤلف', key: 'author', placeholder: 'الاسم' },
  ],
  'ai-chat':         [{ label: 'السؤال', key: 'question', placeholder: 'ما محتوى هذا الملف؟', multiline: true }],
  'prompt-gen':      [{ label: 'الفكرة', key: 'idea', placeholder: 'اكتب المطلوب توليده...', multiline: true }],
  'prompt-check':    [{ label: 'البرومبت', key: 'prompt', placeholder: 'ألصق البرومبت هنا...', multiline: true }],
  humanizer:         [{ label: 'النص', key: 'text', placeholder: 'ألصق النص هنا...', multiline: true }],
  'ai-detector':     [{ label: 'النص', key: 'text', placeholder: 'ألصق النص هنا...', multiline: true }],
  'ai-image-gen':    [{ label: 'وصف الصورة', key: 'prompt', placeholder: 'صف الصورة التي تريد توليدها...', multiline: true }],
  'qr-code':         [{ label: 'الرابط أو النص', key: 'text', placeholder: 'https://amr-7.sa' }],
  barcode:           [{ label: 'النص أو الرقم', key: 'text', placeholder: '12345678' }],
  'whatsapp-link':   [
    { label: 'رقم الهاتف (مع رمز الدولة)', key: 'phone', placeholder: '966505336956' },
    { label: 'الرسالة الافتراضية', key: 'message', placeholder: 'مرحبًا، أريد الاستفسار...', multiline: true },
  ],
  'text-tools':      [{ label: 'النص المطلوب معالجته', key: 'text', placeholder: 'ألصق النص هنا...', multiline: true }],
  calculators:       [{ label: 'المدخلات', key: 'input', placeholder: 'أدخل القيم المطلوبة...', multiline: true }],
  'color-tools':     [{ label: 'كود اللون (HEX أو RGB)', key: 'color', placeholder: '#236D6F' }],
  'dev-tools':       [{ label: 'المدخل', key: 'input', placeholder: 'أدخل النص أو البيانات...', multiline: true }],
  invoice:           [
    { label: 'اسم العميل', key: 'client', placeholder: 'اسم الشركة أو الشخص' },
    { label: 'تفاصيل الخدمة', key: 'details', placeholder: 'الخدمة: ...\nالمبلغ: ...', multiline: true },
  ],
  'email-signature': [
    { label: 'الاسم الكامل', key: 'name', placeholder: 'أحمد محمد' },
    { label: 'المسمى الوظيفي', key: 'title', placeholder: 'مستشار أعمال' },
    { label: 'البريد الإلكتروني', key: 'email', placeholder: 'info@amr-7.sa' },
    { label: 'رقم الهاتف', key: 'phone', placeholder: '0505336956' },
  ],
};

export default function ToolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tool = getToolById(id);
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resultUri, setResultUri] = useState<string | null>(null);
  const [textResult, setTextResult] = useState<string | null>(null);
  const [options, setOptions] = useState<ToolOptions>({});

  if (!tool) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.textMuted} />
        <Text style={styles.notFoundText}>الأداة غير موجودة</Text>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>العودة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isNoFile     = NO_FILE_TOOLS.includes(id ?? '');
  const isMulti      = MULTI_FILE_TOOLS.includes(id ?? '');
  const isTextResult = TEXT_RESULT_TOOLS.includes(id ?? '');
  const isImgResult  = IMAGE_RESULT_TOOLS.includes(id ?? '');
  const toolOpts     = TOOL_OPTIONS[id ?? ''] ?? [];

  const pickFile = async () => {
    try {
      let mimeTypes: string[] = ['application/pdf'];
      if (WORD_TOOLS.includes(id ?? ''))
        mimeTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      else if (EXCEL_TOOLS.includes(id ?? ''))
        mimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      else if (id === 'jpg-to-pdf' || id === 'image-tools')
        mimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

      const result = await DocumentPicker.getDocumentAsync({
        type: mimeTypes,
        multiple: isMulti,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      setFiles(isMulti ? result.assets : [result.assets[0]]);
      setDone(false);
      setResultUri(null);
      setTextResult(null);
    } catch {
      Alert.alert('خطأ', 'لم نتمكن من فتح الملف');
    }
  };

  const execute = async () => {
    if (!isNoFile && files.length === 0) {
      Alert.alert('تنبيه', 'اختر ملفًا أولًا');
      return;
    }
    setLoading(true);
    try {
      const endpoint = `${API_BASE}/${API_MAP[id ?? '']}`;
      const formData = new FormData();

      if (!isNoFile) {
        files.forEach((f) => {
          formData.append(isMulti ? 'files' : 'file', {
            uri: f.uri,
            name: f.name,
            type: f.mimeType ?? 'application/pdf',
          } as any);
        });
      }

      Object.entries(options).forEach(([k, v]) => { if (v) formData.append(k, v); });

      const res = await fetch(endpoint, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `خطأ ${res.status}`);
      }

      if (isTextResult) {
        const data = await res.json();
        setTextResult(data?.result ?? data?.text ?? data?.url ?? JSON.stringify(data, null, 2));
        setDone(true);
      } else {
        const blob = await res.blob();
        const ext = isImgResult || id === 'pdf-to-jpg' ? 'jpg' : 'pdf';
        const localUri = `${FileSystem.cacheDirectory}result_${Date.now()}.${ext}`;
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          await FileSystem.writeAsStringAsync(localUri, base64, { encoding: FileSystem.EncodingType.Base64 });
          setResultUri(localUri);
          setDone(true);
        };
        reader.readAsDataURL(blob);
        return;
      }
    } catch (e: any) {
      Alert.alert('خطأ', e.message ?? 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    if (!resultUri) return;
    const available = await Sharing.isAvailableAsync();
    if (available) {
      const mimeType = resultUri.endsWith('.jpg') ? 'image/jpeg' : 'application/pdf';
      await Sharing.shareAsync(resultUri, { mimeType, dialogTitle: 'مشاركة الملف' });
    } else {
      Alert.alert('تنبيه', 'المشاركة غير متاحة على هذا الجهاز');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerMain}>
          <View style={styles.toolIconBox}>
            <ToolIcon tool={tool} size={28} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.toolName}>{tool.name}</Text>
            <Text style={styles.toolDesc}>{tool.description}</Text>
          </View>
        </View>
      </View>

      {/* File Picker */}
      {!isNoFile && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{isMulti ? 'اختر الملفات' : 'اختر الملف'}</Text>
          <TouchableOpacity style={styles.pickBtn} onPress={pickFile} activeOpacity={0.8}>
            <Ionicons name="document-attach-outline" size={22} color={theme.colors.primary} />
            <Text style={styles.pickBtnText}>
              {files.length > 0
                ? files.length === 1 ? files[0].name : `${files.length} ملفات محددة`
                : 'اضغط لاختيار الملف'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Options */}
      {toolOpts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>الخيارات</Text>
          {toolOpts.map((opt) => (
            <View key={opt.key} style={styles.optionWrap}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <TextInput
                style={[styles.input, opt.multiline && styles.textarea]}
                placeholder={opt.placeholder}
                placeholderTextColor={theme.colors.textMuted}
                value={options[opt.key] ?? ''}
                onChangeText={(v) => setOptions((prev) => ({ ...prev, [opt.key]: v }))}
                multiline={opt.multiline}
                numberOfLines={opt.multiline ? 4 : 1}
                textAlignVertical={opt.multiline ? 'top' : 'center'}
                textAlign="right"
              />
            </View>
          ))}
        </View>
      )}

      {/* Execute */}
      <TouchableOpacity
        style={[styles.execBtn, loading && styles.execBtnDisabled]}
        onPress={execute}
        activeOpacity={0.82}
        disabled={loading}
      >
        {loading ? (
          <><ActivityIndicator color="#fff" size="small" /><Text style={styles.execBtnText}>جاري التنفيذ...</Text></>
        ) : (
          <><Ionicons name="flash-outline" size={20} color="#fff" /><Text style={styles.execBtnText}>تنفيذ الأداة</Text></>
        )}
      </TouchableOpacity>

      {/* Text Result */}
      {textResult && (
        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>النتيجة</Text>
          <ScrollView style={styles.textResultBox} nestedScrollEnabled>
            <Text style={styles.textResultContent}>{textResult}</Text>
          </ScrollView>
        </View>
      )}

      {/* File Result */}
      {done && resultUri && (
        <View style={styles.resultSection}>
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={22} color={theme.colors.success} />
            <Text style={styles.successText}>تم تنفيذ الأداة بنجاح</Text>
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={share} activeOpacity={0.82}>
            <Ionicons name="share-outline" size={20} color="#fff" />
            <Text style={styles.shareBtnText}>مشاركة / تنزيل الملف</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Support */}
      <TouchableOpacity
        style={styles.supportLink}
        onPress={() => router.push({ pathname: '/support', params: { tool: tool.name } })}
        activeOpacity={0.8}
      >
        <Ionicons name="help-circle-outline" size={16} color={theme.colors.textMuted} />
        <Text style={styles.supportLinkText}>مشكلة في هذه الأداة؟ تواصل مع الدعم</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 60 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: theme.colors.background },
  notFoundText: { fontSize: 16, color: theme.colors.textMuted, fontFamily: theme.fonts.bold },
  backLink: { marginTop: 4 },
  backLinkText: { fontSize: 14, color: theme.colors.primary, fontFamily: theme.fonts.bold },

  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 14,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
    alignSelf: 'flex-end',
  },
  headerMain: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  toolIconBox: {
    width: 58, height: 58,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: { flex: 1, alignItems: 'flex-end' },
  toolName: { fontSize: 20, color: theme.colors.text, fontFamily: theme.fonts.black, textAlign: 'right' },
  toolDesc: { fontSize: 13, color: theme.colors.textMuted, fontFamily: theme.fonts.regular, textAlign: 'right', marginTop: 4 },

  section: { marginHorizontal: 16, marginTop: 20 },
  sectionLabel: { fontSize: 14, color: theme.colors.text, fontFamily: theme.fonts.bold, textAlign: 'right', marginBottom: 10 },

  pickBtn: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5, borderColor: theme.colors.border,
    borderStyle: 'dashed',
    paddingVertical: 22, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  pickBtnText: { fontSize: 14, color: theme.colors.text, fontFamily: theme.fonts.bold, textAlign: 'center', flex: 1 },

  optionWrap: { marginBottom: 14 },
  optionLabel: { fontSize: 13, color: theme.colors.textSecondary, fontFamily: theme.fonts.bold, textAlign: 'right', marginBottom: 6 },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1, borderColor: theme.colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: theme.colors.text,
    fontFamily: theme.fonts.regular, textAlign: 'right',
  },
  textarea: { height: 110, paddingTop: 12 },

  execBtn: {
    marginHorizontal: 16, marginTop: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  execBtnDisabled: { opacity: 0.65 },
  execBtnText: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.bold },

  resultSection: { marginHorizontal: 16, marginTop: 20 },
  resultLabel: { fontSize: 14, color: theme.colors.text, fontFamily: theme.fonts.bold, textAlign: 'right', marginBottom: 10 },
  textResultBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1, borderColor: theme.colors.border,
    padding: 16, maxHeight: 320,
  },
  textResultContent: { fontSize: 14, color: theme.colors.text, fontFamily: theme.fonts.regular, textAlign: 'right', lineHeight: 24 },

  successBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginBottom: 12 },
  successText: { fontSize: 15, color: theme.colors.success, fontFamily: theme.fonts.bold },
  shareBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  shareBtnText: { color: '#fff', fontSize: 15, fontFamily: theme.fonts.bold },

  supportLink: {
    marginHorizontal: 16, marginTop: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6,
  },
  supportLinkText: { fontSize: 12, color: theme.colors.textMuted, fontFamily: theme.fonts.regular },
});