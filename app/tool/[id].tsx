import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { theme } from '@/constants/theme';
import { ALL_TOOLS } from '@/constants/tools';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';

const API_BASE = 'https://pdf.amr7.io/api';

const API_MAP: Record<string, string> = {
  'merge': 'merge-pdf',
  'split': 'split-pdf',
  'compress': 'compress-pdf',
  'rotate': 'rotate-pdf',
  'extract-pages': 'extract-pages',
  'delete-pages': 'delete-pages',
  'crop': 'crop-pdf',
  'resize': 'resize-pdf',
  'add-page-numbers': 'add-page-numbers',
  'header-footer': 'header-footer-pdf',
  'watermark': 'watermark-pdf',
  'protect': 'protect-pdf',
  'unlock': 'unlock-pdf',
  'edit-metadata': 'edit-pdf-metadata',
  'flatten': 'flatten-pdf',
  'repair': 'repair-pdf',
  'grayscale': 'grayscale-pdf',
  'extract-images': 'extract-images',
  'ocr': 'ocr-pdf',
  'pdf-to-jpg': 'pdf-to-jpg',
  'word-to-pdf': 'word-to-pdf',
  'excel-to-pdf': 'excel-to-pdf',
  'ai-chat': 'ai/chat-pdf',
  'ai-summarize': 'ai/summarize',
  'ai-tables': 'ai/extract-tables',
  'prompt-gen': 'ai/prompt-generator',
  'prompt-check': 'ai/prompt-checker',
  'ai-detector': 'ai/detector',
  'humanizer': 'ai/humanizer',
};

const MULTI_FILE_TOOLS = ['merge'];
const TEXT_RESULT_TOOLS = ['ocr', 'ai-chat', 'ai-summarize', 'ai-tables', 'prompt-gen', 'prompt-check', 'ai-detector', 'humanizer'];
const WORD_TOOLS = ['word-to-pdf'];
const EXCEL_TOOLS = ['excel-to-pdf'];

type ToolOptions = Record<string, string>;

const TOOL_OPTIONS: Record<string, { label: string; key: string; placeholder: string; type?: string; options?: string[] }[]> = {
  'rotate': [{ label: 'زاوية الدوران', key: 'angle', placeholder: '90', options: ['90', '180', '270'] }],
  'split': [{ label: 'أرقام الصفحات (مثال: 1,3,5)', key: 'pages', placeholder: '1,2,3' }],
  'extract-pages': [{ label: 'أرقام الصفحات (مثال: 1-3)', key: 'pages', placeholder: '1-3' }],
  'delete-pages': [{ label: 'أرقام الصفحات للحذف', key: 'pages', placeholder: '2,4' }],
  'watermark': [
    { label: 'نص العلامة المائية', key: 'text', placeholder: 'سري - AMR7' },
    { label: 'الشفافية (0-1)', key: 'opacity', placeholder: '0.3' },
  ],
  'protect': [
    { label: 'كلمة المرور', key: 'password', placeholder: 'أدخل كلمة المرور', type: 'password' },
  ],
  'unlock': [
    { label: 'كلمة المرور الحالية', key: 'password', placeholder: 'أدخل كلمة المرور', type: 'password' },
  ],
  'crop': [
    { label: 'يسار (px)', key: 'left', placeholder: '0' },
    { label: 'أعلى (px)', key: 'top', placeholder: '0' },
    { label: 'يمين (px)', key: 'right', placeholder: '50' },
    { label: 'أسفل (px)', key: 'bottom', placeholder: '50' },
  ],
  'resize': [
    { label: 'العرض (pt)', key: 'width', placeholder: '595' },
    { label: 'الارتفاع (pt)', key: 'height', placeholder: '842' },
  ],
  'add-page-numbers': [
    { label: 'الموضع', key: 'position', placeholder: 'bottom-center', options: ['bottom-center', 'bottom-right', 'bottom-left', 'top-center'] },
    { label: 'حجم الخط', key: 'fontSize', placeholder: '12' },
  ],
  'header-footer': [
    { label: 'نص الرأس', key: 'header', placeholder: 'AMR7 - سري' },
    { label: 'نص التذييل', key: 'footer', placeholder: 'صفحة {page}' },
  ],
  'edit-metadata': [
    { label: 'عنوان المستند', key: 'title', placeholder: 'عنوان الملف' },
    { label: 'المؤلف', key: 'author', placeholder: 'اسم المؤلف' },
  ],
  'compress': [
    { label: 'جودة الضغط', key: 'quality', placeholder: 'medium', options: ['low', 'medium', 'high'] },
  ],
  'ai-chat': [{ label: 'سؤالك عن الملف', key: 'question', placeholder: 'ما هو موضوع هذا المستند؟' }],
  'prompt-gen': [{ label: 'وصف ما تريد', key: 'idea', placeholder: 'أريد كتابة قصيدة عن...' }],
  'prompt-check': [{ label: 'البرومبت للفحص', key: 'prompt', placeholder: 'أدخل البرومبت هنا...' }],
  'humanizer': [{ label: 'النص المراد أنسنته', key: 'text', placeholder: 'أدخل النص هنا...' }],
  'ai-detector': [{ label: 'النص للفحص', key: 'text', placeholder: 'أدخل النص هنا...' }],
};

export default function ToolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tool = ALL_TOOLS.find(t => t.id === id);
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [resultUri, setResultUri] = useState<string | null>(null);
  const [textResult, setTextResult] = useState<string | null>(null);
  const [options, setOptions] = useState<ToolOptions>({});
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>({});

  if (!tool) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>الأداة غير موجودة</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>رجوع</Text>
      </TouchableOpacity>
    </View>
  );

  const isMulti = MULTI_FILE_TOOLS.includes(id as string);
  const isText = TEXT_RESULT_TOOLS.includes(id as string);
  const toolOptions = TOOL_OPTIONS[id as string] || [];
  const isTextOnlyTool = ['prompt-gen', 'prompt-check', 'humanizer', 'ai-detector'].includes(id as string);

  const getFileType = () => {
    if (WORD_TOOLS.includes(id as string)) return 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (EXCEL_TOOLS.includes(id as string)) return 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return 'application/pdf';
  };

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: getFileType(),
        multiple: isMulti,
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setFiles(result.assets);
        setDone(false);
        setResultUri(null);
        setTextResult(null);
      }
    } catch (e) {
      Alert.alert('خطأ', 'تعذر اختيار الملف');
    }
  };

  const processFile = async () => {
    if (!isTextOnlyTool && files.length === 0) return Alert.alert('تنبيه', 'اختر ملفاً أولاً');
    setLoading(true);
    setProgress(20);
    setDone(false);

    try {
      const apiRoute = API_MAP[id as string] || id;
      const formData = new FormData();

      if (!isTextOnlyTool) {
        if (isMulti) {
          files.forEach(file => {
            formData.append('files', { uri: file.uri, name: file.name, type: file.mimeType || 'application/pdf' } as any);
          });
        } else {
          formData.append('file', { uri: files[0].uri, name: files[0].name, type: files[0].mimeType || 'application/pdf' } as any);
        }
      }

      // إضافة الخيارات
      Object.entries(options).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      Object.entries(selectedOption).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      setProgress(40);

      const isJsonTool = isTextOnlyTool;
      const response = await fetch(`${API_BASE}/${apiRoute}`, {
        method: "POST",
        headers: isJsonTool ? { "Content-Type": "application/json" } : {},
        body: isJsonTool ? JSON.stringify(options) : formData,
      });

      setProgress(70);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `خطأ ${response.status}` }));
        throw new Error(err.error || `خطأ ${response.status}`);
      }

      if (isText) {
        const json = await response.json();
        setTextResult(json.text || json.result || json.humanized || json.output || JSON.stringify(json, null, 2));
        setProgress(100);
        setLoading(false);
        setDone(true);
        return;
      }

      const ext = id === 'pdf-to-jpg' ? 'jpg' : 'pdf';
      const fileName = `amr7_${id}_${Date.now()}.${ext}`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      const base64 = await response.blob().then(blob => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));

      setProgress(85);
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      setResultUri(fileUri);
      setProgress(100);
      setLoading(false);
      setDone(true);

    } catch (e: any) {
      setLoading(false);
      setProgress(0);
      Alert.alert('خطأ في المعالجة', e.message || 'حاول مرة أخرى');
    }
  };

  const shareFile = async () => {
    if (!resultUri) return;
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) await Sharing.shareAsync(resultUri);
  };

  const reset = () => {
    setFiles([]);
    setDone(false);
    setResultUri(null);
    setTextResult(null);
    setProgress(0);
    setOptions({});
    setSelectedOption({});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Text style={styles.backIconText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.toolIcon}>{tool.icon}</Text>
        <Text style={styles.toolName}>{tool.name}</Text>
      </View>

      {/* Upload */}
      {!isTextOnlyTool && (
        <TouchableOpacity style={styles.uploadArea} onPress={pickFiles} activeOpacity={0.7}>
          {files.length === 0 ? (
            <>
              <Text style={styles.uploadIcon}>📂</Text>
              <Text style={styles.uploadTitle}>
                {WORD_TOOLS.includes(id as string) ? 'اختر ملف Word' :
                 EXCEL_TOOLS.includes(id as string) ? 'اختر ملف Excel' :
                 'اختر ملف PDF'}
              </Text>
              <Text style={styles.uploadSub}>{isMulti ? 'يمكنك اختيار أكثر من ملف' : 'اضغط لاختيار الملف'}</Text>
            </>
          ) : (
            <>
              <Text style={styles.uploadIcon}>✅</Text>
              <Text style={styles.uploadTitle}>{files.length > 1 ? `${files.length} ملفات` : files[0].name}</Text>
              <Text style={styles.uploadSub}>اضغط لتغيير الملف</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Files List */}
      {files.length > 1 && (
        <View style={styles.filesList}>
          {files.map((f, i) => (
            <View key={i} style={styles.fileRow}>
              <Text style={styles.fileSize}>{((f.size || 0) / 1024).toFixed(0)} KB</Text>
              <Text style={styles.fileName} numberOfLines={1}>{f.name}</Text>
              <View style={styles.fileNumBadge}><Text style={styles.fileNum}>{i + 1}</Text></View>
            </View>
          ))}
        </View>
      )}

      {/* Tool Options */}
      {toolOptions.length > 0 && (
        <View style={styles.optionsBox}>
          <Text style={styles.optionsTitle}>خيارات الأداة</Text>
          {toolOptions.map(opt => (
            <View key={opt.key} style={styles.optionItem}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              {opt.options ? (
                <View style={styles.optionButtons}>
                  {opt.options.map(o => (
                    <TouchableOpacity
                      key={o}
                      style={[styles.optionBtn, (selectedOption[opt.key] || opt.options![0]) === o && styles.optionBtnActive]}
                      onPress={() => setSelectedOption(prev => ({ ...prev, [opt.key]: o }))}
                    >
                      <Text style={[(selectedOption[opt.key] || opt.options![0]) === o ? styles.optionBtnTextActive : styles.optionBtnText]}>{o}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextInput
                  style={styles.optionInput}
                  placeholder={opt.placeholder}
                  placeholderTextColor={theme.colors.textMuted}
                  value={options[opt.key] || ''}
                  onChangeText={v => setOptions(prev => ({ ...prev, [opt.key]: v }))}
                  secureTextEntry={opt.type === 'password'}
                  textAlign="right"
                  multiline={['text', 'prompt', 'description', 'question'].includes(opt.key)}
                  numberOfLines={['text', 'prompt', 'description', 'question'].includes(opt.key) ? 4 : 1}
                />
              )}
            </View>
          ))}
        </View>
      )}

      {/* Progress */}
      {loading && (
        <View style={styles.progressBox}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
          </View>
          <Text style={styles.progressText}>جاري المعالجة... {progress}%</Text>
          <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 8 }} />
        </View>
      )}

      {/* Process Button */}
      {!done && !loading && (
        <TouchableOpacity
          style={[styles.processBtn, (!isTextOnlyTool && files.length === 0) && styles.processBtnDisabled]}
          onPress={processFile}
          disabled={!isTextOnlyTool && files.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.processBtnText}>تطبيق {tool.name} ←</Text>
        </TouchableOpacity>
      )}

      {/* Text Result */}
      {done && textResult && (
        <View style={styles.resultBox}>
          <Text style={styles.resultIcon}>✅</Text>
          <Text style={styles.resultTitle}>تمت المعالجة!</Text>
          <ScrollView style={styles.textResultBox} nestedScrollEnabled>
            <Text style={styles.textResultContent} selectable>{textResult}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.newBtn} onPress={reset}>
            <Text style={styles.newBtnText}>معالجة جديدة</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* File Result */}
      {done && resultUri && (
        <View style={styles.resultBox}>
          <Text style={styles.resultIcon}>🎉</Text>
          <Text style={styles.resultTitle}>تمت المعالجة بنجاح!</Text>
          <TouchableOpacity style={styles.downloadBtn} onPress={shareFile}>
            <Text style={styles.downloadBtnText}>⬇ تحميل / مشاركة الملف</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.newBtn} onPress={reset}>
            <Text style={styles.newBtnText}>معالجة ملف جديد</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  errorText: { fontSize: 16, color: theme.colors.text, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 65, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border, gap: 10 },
  backIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },
  backIconText: { fontSize: 18, color: theme.colors.primary },
  toolIcon: { fontSize: 26 },
  toolName: { fontSize: 20, fontWeight: '900', color: theme.colors.text, flex: 1 },
  uploadArea: { margin: 16, borderRadius: theme.radius.xl, borderWidth: 2, borderColor: theme.colors.primary + '50', borderStyle: 'dashed', backgroundColor: theme.colors.primaryLight, padding: 36, alignItems: 'center' },
  uploadIcon: { fontSize: 44, marginBottom: 10 },
  uploadTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 6, textAlign: 'center' },
  uploadSub: { fontSize: 13, color: theme.colors.textMuted, textAlign: 'center' },
  filesList: { marginHorizontal: 16, marginBottom: 12, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden' },
  fileRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border, gap: 10 },
  fileNumBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  fileNum: { color: '#fff', fontSize: 12, fontWeight: '800' },
  fileName: { flex: 1, fontSize: 13, color: theme.colors.text, fontWeight: '600', textAlign: 'right' },
  fileSize: { fontSize: 11, color: theme.colors.textMuted },
  optionsBox: { marginHorizontal: 16, marginBottom: 8, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: 16, borderWidth: 1, borderColor: theme.colors.border },
  optionsTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.text, textAlign: 'right', marginBottom: 14 },
  optionItem: { marginBottom: 14 },
  optionLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.textMuted, textAlign: 'right', marginBottom: 8 },
  optionButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  optionBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 50, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  optionBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  optionBtnText: { fontSize: 13, color: theme.colors.textMuted, fontWeight: '600' },
  optionBtnTextActive: { fontSize: 13, color: '#fff', fontWeight: '700' },
  optionInput: { backgroundColor: theme.colors.background, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, padding: 12, fontSize: 14, color: theme.colors.text, textAlignVertical: 'top' },
  progressBox: { margin: 16, padding: 20, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  progressBar: { width: '100%', height: 8, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: 8, backgroundColor: theme.colors.primary, borderRadius: 4 },
  progressText: { fontSize: 13, color: theme.colors.textMuted, fontWeight: '600' },
  processBtn: { margin: 16, backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg, padding: 18, alignItems: 'center', shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  processBtnDisabled: { opacity: 0.4 },
  processBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  resultBox: { margin: 16, padding: 24, backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.primary + '30', alignItems: 'center' },
  resultIcon: { fontSize: 48, marginBottom: 10 },
  resultTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.text, marginBottom: 20 },
  textResultBox: { width: '100%', backgroundColor: theme.colors.background, borderRadius: theme.radius.md, padding: 14, marginBottom: 16, maxHeight: 300 },
  textResultContent: { fontSize: 13, color: theme.colors.text, lineHeight: 22, textAlign: 'right' },
  downloadBtn: { width: '100%', backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg, padding: 16, alignItems: 'center', marginBottom: 10 },
  downloadBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  newBtn: { width: '100%', backgroundColor: theme.colors.background, borderRadius: theme.radius.lg, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  newBtnText: { color: theme.colors.text, fontSize: 14, fontWeight: '700' },
  backBtn: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: theme.radius.lg, marginTop: 12 },
  backBtnText: { color: '#fff', fontWeight: '800' },
});
