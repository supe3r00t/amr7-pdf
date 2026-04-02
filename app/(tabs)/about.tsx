import { View, Text, ScrollView, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tagline}>بيئة رقمية آمنة لإدارة مستندات أعمالك</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>من نحن</Text>
        <Text style={styles.body}>انطلاقاً من خبرتنا الطويلة في قطاع الأعمال في السعودية، صممنا منصة سحابية تضمن لك معالجة وتعديل ملفات PDF بأعلى معايير السرية والأمان والموثوقية، لتنجز مهامك بثقة تامة.</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>100%</Text>
          <Text style={styles.statLabel}>تشفير البيانات</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>تخزين للملفات</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>15+</Text>
          <Text style={styles.statLabel}>أداة احترافية</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>رؤيتنا</Text>
        <Text style={styles.body}>أن نكون المنصة الرقمية الأولى والأكثر أماناً في المملكة العربية السعودية للتعامل مع المستندات وملفات الأعمال.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>رسالتنا</Text>
        <Text style={styles.body}>تزويد قطاع الأعمال والأفراد بأدوات سحابية ذكية وسريعة لمعالجة ملفات PDF دون التنازل عن معايير الخصوصية الصارمة.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>لماذا آمر 7؟</Text>
        {[
          { t: 'تشفير متقدم', d: 'تشفير اتصالك وملفاتك أثناء الرفع والمعالجة بأحدث بروتوكولات TLS/SSL' },
          { t: 'حذف تلقائي', d: 'لا يتم تخزين مستنداتك — تُحذف تلقائياً فور انتهاء العملية' },
          { t: 'سرعة فائقة', d: 'خوادمنا تعالج الملفات الكبيرة في ثوانٍ معدودة' },
          { t: 'سهولة تامة', d: 'واجهة عربية مصممة لتجربة مستخدم سلسة بلا تعقيدات' },
        ].map(item => (
          <View key={item.t} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{item.t}</Text>
              <Text style={styles.featureDesc}>{item.d}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.legalSection}>
        <Text style={styles.sectionTitle}>معلومات قانونية</Text>
        <View style={styles.legalRow}><Text style={styles.legalKey}>سجل تجاري</Text><Text style={styles.legalVal}>7041008108</Text></View>
        <View style={styles.legalRow}><Text style={styles.legalKey}>الرقم الضريبي</Text><Text style={styles.legalVal}>310892748800003</Text></View>
        <View style={styles.legalRow}><Text style={styles.legalKey}>الموقع</Text><Text style={styles.legalVal}>الرياض - حي النفل</Text></View>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL('https://amr-7.sa')}>
        <Text style={styles.btnText}>خدمات الأعمال ←</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { alignItems: 'center', paddingTop: 65, paddingBottom: 24, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  logo: { width: 160, height: 56 },
  tagline: { fontSize: 13, color: theme.colors.textMuted, marginTop: 8, textAlign: 'center', paddingHorizontal: 20 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  statNum: { fontSize: 20, fontWeight: '900', color: theme.colors.primary },
  statLabel: { fontSize: 10, color: theme.colors.textMuted, marginTop: 4, textAlign: 'center' },
  section: { backgroundColor: theme.colors.surface, marginHorizontal: 16, marginBottom: 12, borderRadius: theme.radius.lg, padding: 18, borderWidth: 1, borderColor: theme.colors.border },
  legalSection: { backgroundColor: theme.colors.surface, marginHorizontal: 16, marginBottom: 12, borderRadius: theme.radius.lg, padding: 18, borderWidth: 1, borderColor: theme.colors.border },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, textAlign: 'right', marginBottom: 10 },
  body: { fontSize: 14, color: theme.colors.textMuted, lineHeight: 24, textAlign: 'right' },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 10 },
  featureDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, marginTop: 6 },
  featureTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.text, textAlign: 'right' },
  featureDesc: { fontSize: 12, color: theme.colors.textMuted, textAlign: 'right', marginTop: 2 },
  legalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  legalKey: { fontSize: 13, color: theme.colors.textMuted, fontWeight: '700' },
  legalVal: { fontSize: 13, color: theme.colors.text },
  btn: { margin: 16, backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
