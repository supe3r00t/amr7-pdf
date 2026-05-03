import { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    I18nManager,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// القيم الثابتة (يمكنك لاحقاً ربط سعر الذهب بـ API لتحديثه تلقائياً)
const GOLD_PRICE_SAR = 310;
const SILVER_PRICE_SAR = 4;
const NISAB_SAR = 85 * GOLD_PRICE_SAR;
const ZAKAT_RATE = 0.025;

export default function ZakatScreen() {
    const insets = useSafeAreaInsets();

    const [values, setValues] = useState({
        cash: '', gold: '', silver: '', stocks: '',
        receivables: '', inventory: '', debts: '',
    });
    const [result, setResult] = useState<{ total: number; zakat: number } | null>(null);

    const update = (key: string, val: string) => {
        // السماح بالأرقام فقط
        const numericVal = val.replace(/[^0-9.]/g, '');
        setValues(p => ({ ...p, [key]: numericVal }));
    };

    const calculate = () => {
        Keyboard.dismiss();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const goldValue = (Number(values.gold) || 0) * GOLD_PRICE_SAR;
        const silverValue = (Number(values.silver) || 0) * SILVER_PRICE_SAR;
        const total = (Number(values.cash) || 0) + goldValue + silverValue +
            (Number(values.stocks) || 0) + (Number(values.receivables) || 0) +
            (Number(values.inventory) || 0) - (Number(values.debts) || 0);

        const zakat = total >= NISAB_SAR ? total * ZAKAT_RATE : 0;

        // تفاعل لمسي مختلف بناءً على النتيجة
        if (zakat > 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        setResult({ total, zakat });
    };

    const fields = [
        { key: 'cash', label: 'السيولة النقدية والأرصدة', icon: 'cash-outline' },
        { key: 'gold', label: 'الذهب المدخر (بالجرام)', icon: 'diamond-outline' },
        { key: 'silver', label: 'الفضة المدخرة (بالجرام)', icon: 'ellipse-outline' },
        { key: 'stocks', label: 'الأسهم والصناديق الاستثمارية', icon: 'trending-up-outline' },
        { key: 'receivables', label: 'الديون المرجوة (لك)', icon: 'arrow-down-circle-outline' },
        { key: 'inventory', label: 'عروض التجارة والمخزون', icon: 'cube-outline' },
        { key: 'debts', label: 'الالتزامات والديون (تُخصم)', icon: 'arrow-up-circle-outline', isDeduction: true },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Section */}
                <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
                        <Ionicons
                            name={I18nManager.isRTL ? 'chevron-forward' : 'chevron-back'}
                            size={22}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.title}>الحاسبة الزكوية</Text>
                    </View>
                    <View style={styles.headerIconBox}>
                        <MaterialCommunityIcons name="calculator-variant-outline" size={20} color={theme.colors.primary} />
                    </View>
                </View>

                {/* Nisab Info */}
                <View style={styles.nisabBox}>
                    <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
                    <Text style={styles.nisabText}>
                        نصاب حولان الحول التقديري: <Text style={{fontFamily: theme.fonts.black}}>{NISAB_SAR.toLocaleString()}</Text> ريال
                    </Text>
                </View>

                {/* Form Inputs */}
                <View style={styles.formBox}>
                    {fields.map(f => (
                        <View key={f.key} style={styles.fieldRow}>
                            <View style={styles.fieldLabelContainer}>
                                <Ionicons name={f.icon as any} size={20} color={f.isDeduction ? theme.colors.warning : theme.colors.primary} />
                                <Text style={[styles.fieldLabel, f.isDeduction && { color: theme.colors.warning }]}>{f.label}</Text>
                            </View>
                            <TextInput
                                style={[styles.input, f.isDeduction && styles.inputWarning]}
                                value={values[f.key as keyof typeof values]}
                                onChangeText={v => update(f.key, v)}
                                keyboardType="decimal-pad"
                                placeholder="0"
                                placeholderTextColor={theme.colors.textMuted}
                                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                                returnKeyType="done"
                            />
                        </View>
                    ))}
                </View>

                {/* Calculate Action */}
                <TouchableOpacity style={styles.calcBtn} onPress={calculate} activeOpacity={0.85}>
                    <Text style={styles.calcBtnText}>احتساب الوعاء الزكوي</Text>
                    <Ionicons
                        name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>

                {/* Results */}
                {result && (
                    <View style={[styles.resultBox, result.zakat > 0 ? styles.resultGreen : styles.resultGray]}>
                        <MaterialCommunityIcons
                            name={result.zakat > 0 ? "check-decagram" : "shield-alert-outline"}
                            size={48}
                            color={result.zakat > 0 ? theme.colors.success : theme.colors.textMuted}
                            style={{ marginBottom: 12 }}
                        />
                        {result.zakat > 0 ? (
                            <>
                                <Text style={styles.resultLabel}>إجمالي الوعاء الخاضع للزكاة</Text>
                                <Text style={styles.resultTotal}>{result.total.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ريال</Text>
                                <View style={styles.zakatBox}>
                                    <Text style={styles.zakatLabel}>الزكاة الواجب إخراجها (2.5%)</Text>
                                    <Text style={styles.zakatAmount}>{result.zakat.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ريال</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.noZakatTitle}>لم يبلغ النصاب المعتبر</Text>
                                <Text style={styles.noZakatSub}>إجمالي المدخرات ({result.total.toLocaleString()} ريال) أقل من نصاب حولان الحول.</Text>
                            </>
                        )}
                        <Text style={styles.disclaimer}>* هذه الأداة لغرض التقدير المبدئي، ويُنصح بالرجوع لأهل الاختصاص الشرعي في المسائل الدقيقة.</Text>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },

    header: {
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 12,
        paddingHorizontal: 20,
    },
    backBtn: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    headerTitleContainer: {
        alignItems: 'flex-start',
        flex: 1,
    },
    title: {
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        fontSize: 18,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    headerIconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.borderBrand,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },

    nisabBox: {
        margin: 20,
        flexDirection: 'row',
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.lg,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: theme.colors.borderBrand
    },
    nisabText: { fontSize: 14, color: theme.colors.primaryDark, fontFamily: theme.fonts.medium },

    formBox: {
        marginHorizontal: 20,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.xl,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        ...theme.shadow.sm,
        gap: 16
    },
    fieldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    fieldLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    fieldLabel: { fontSize: 14, fontFamily: theme.fonts.bold, color: theme.colors.textSecondary, textAlign: I18nManager.isRTL ? 'right' : 'left' },

    input: {
        width: 120,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: theme.colors.text,
        backgroundColor: theme.colors.surfaceAlt,
        fontFamily: theme.fonts.medium
    },
    inputWarning: { borderColor: theme.colors.warning + '50', backgroundColor: theme.colors.warningBg },

    calcBtn: {
        marginHorizontal: 20,
        marginTop: 24,
        backgroundColor: theme.colors.primary,
        borderRadius: 18,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...theme.shadow.sm,
    },
    calcBtnText: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.bold },

    resultBox: { margin: 20, borderRadius: theme.radius.xl, padding: 24, alignItems: 'center', borderWidth: 1, ...theme.shadow.md },
    resultGreen: { backgroundColor: '#F0FAF5', borderColor: '#C6EEDB' },
    resultGray: { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight },

    resultLabel: { fontSize: 14, color: theme.colors.textSecondary, fontFamily: theme.fonts.medium, marginBottom: 8 },
    resultTotal: { fontSize: 26, fontFamily: theme.fonts.black, color: theme.colors.text, marginBottom: 24 },

    zakatBox: { width: '100%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#C6EEDB', ...theme.shadow.sm },
    zakatLabel: { fontSize: 13, color: theme.colors.textMuted, fontFamily: theme.fonts.medium, marginBottom: 8 },
    zakatAmount: { fontSize: 32, fontFamily: theme.fonts.black, color: theme.colors.success },

    noZakatTitle: { fontSize: 20, fontFamily: theme.fonts.black, color: theme.colors.text, marginBottom: 12 },
    noZakatSub: { fontSize: 14, color: theme.colors.textSecondary, fontFamily: theme.fonts.medium, textAlign: 'center', lineHeight: 22 },

    disclaimer: { fontSize: 12, color: theme.colors.textMuted, marginTop: 24, textAlign: 'center', fontFamily: theme.fonts.regular, lineHeight: 18 },
});
