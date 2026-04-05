import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import { useState } from 'react';

const NISAB_SAR = 85 * 310;
const ZAKAT_RATE = 0.025;

export default function ZakatScreen() {
  const [values, setValues] = useState({
    cash: '', gold: '', silver: '', stocks: '',
    receivables: '', inventory: '', debts: '',
  });
  const [result, setResult] = useState<{ total: number; zakat: number } | null>(null);

  const update = (key: string, val: string) => setValues(p => ({ ...p, [key]: val }));

  const calculate = () => {
    const goldValue = (Number(values.gold) || 0) * 310;
    const silverValue = (Number(values.silver) || 0) * 4;
    const total = (Number(values.cash) || 0) + goldValue + silverValue +
      (Number(values.stocks) || 0) + (Number(values.receivables) || 0) +
      (Number(values.inventory) || 0) - (Number(values.debts) || 0);
    const zakat = total >= NISAB_SAR ? total * ZAKAT_RATE : 0;
    setResult({ total, zakat });
  };

  const fields = [
    { key: 'cash', label: 'النقد والبنك (ريال)' },
    { key: 'gold', label: 'الذهب (جرام)' },
    { key: 'silver', label: 'الفضة (جرام)' },
    { key: 'stocks', label: 'الأسهم والاستثمارات (ريال)' },
    { key: 'receivables', label: 'الديون المستحقة لك (ريال)' },
    { key: 'inventory', label: 'البضاعة والمخزون (ريال)' },
    { key: 'debts', label: 'الديون عليك — تُخصم (ريال)' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Text style={styles.backIconText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.title}>حاسبة الزكاة</Text>
        <Text style={styles.icon}>☪️</Text>
      </View>

      <View style={styles.nisabBox}>
        <Text style={styles.nisabText}>النصاب الحالي ≈ {NISAB_SAR.toLocaleString()} ريال</Text>
      </View>

      <View style={styles.formBox}>
        {fields.map(f => (
          <View key={f.key} style={styles.fieldRow}>
            <TextInput
              style={styles.input}
              value={values[f.key as keyof typeof values]}
              onChangeText={v => update(f.key, v)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={theme.colors.textMuted}
            />
            <Text style={styles.fieldLabel}>{f.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
        <Text style={styles.calcBtnText}>احسب الزكاة ←</Text>
      </TouchableOpacity>

      {result && (
        <View style={[styles.resultBox, result.zakat > 0 ? styles.resultGreen : styles.resultGray]}>
          <Text style={styles.resultIcon}>{result.zakat > 0 ? '🌙' : 'ℹ️'}</Text>
          {result.zakat > 0 ? (
            <>
              <Text style={styles.resultLabel}>إجمالي الوعاء الزكوي</Text>
              <Text style={styles.resultTotal}>{result.total.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ريال</Text>
              <View style={styles.zakatBox}>
                <Text style={styles.zakatLabel}>الزكاة الواجبة (2.5%)</Text>
                <Text style={styles.zakatAmount}>{result.zakat.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ريال</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.noZakatTitle}>لا تجب عليك الزكاة</Text>
              <Text style={styles.noZakatSub}>مالك ({result.total.toLocaleString()} ريال) لم يبلغ النصاب</Text>
            </>
          )}
          <Text style={styles.disclaimer}>* هذه حاسبة تقريبية، يُنصح باستشارة عالم شرعي</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 65, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border, gap: 10 },
  backIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },
  backIconText: { fontSize: 18, color: theme.colors.primary },
  title: { fontSize: 20, fontFamily: theme.fonts.black, color: theme.colors.text, flex: 1, textAlign: 'right' },
  icon: { fontSize: 26 },
  nisabBox: { margin: 16, backgroundColor: theme.colors.primaryLight, borderRadius: theme.radius.lg, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.primary + '30' },
  nisabText: { fontSize: 13, color: theme.colors.primaryDark, fontFamily: theme.fonts.bold },
  formBox: { marginHorizontal: 16, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 12 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fieldLabel: { flex: 1, fontSize: 13, fontFamily: theme.fonts.bold, color: theme.colors.text, textAlign: 'right' },
  input: { width: 100, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 10, textAlign: 'center', fontSize: 14, color: theme.colors.text, backgroundColor: theme.colors.background, fontFamily: theme.fonts.regular },
  calcBtn: { margin: 16, backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg, padding: 18, alignItems: 'center' },
  calcBtnText: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.black },
  resultBox: { marginHorizontal: 16, borderRadius: theme.radius.xl, padding: 24, alignItems: 'center', borderWidth: 1 },
  resultGreen: { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary + '40' },
  resultGray: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
  resultIcon: { fontSize: 48, marginBottom: 10 },
  resultLabel: { fontSize: 13, color: theme.colors.textMuted, fontFamily: theme.fonts.regular, marginBottom: 4 },
  resultTotal: { fontSize: 22, fontFamily: theme.fonts.black, color: theme.colors.text, marginBottom: 16 },
  zakatBox: { width: '100%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.primary + '30' },
  zakatLabel: { fontSize: 12, color: theme.colors.textMuted, fontFamily: theme.fonts.regular, marginBottom: 4 },
  zakatAmount: { fontSize: 28, fontFamily: theme.fonts.black, color: theme.colors.primary },
  noZakatTitle: { fontSize: 18, fontFamily: theme.fonts.black, color: theme.colors.text, marginBottom: 8 },
  noZakatSub: { fontSize: 13, color: theme.colors.textMuted, fontFamily: theme.fonts.regular, textAlign: 'center' },
  disclaimer: { fontSize: 11, color: theme.colors.textMuted, marginTop: 16, textAlign: 'center', fontFamily: theme.fonts.regular },
});
