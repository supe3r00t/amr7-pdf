import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { theme } from '@/constants/theme';

export default function ContactScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>تواصل معنا</Text>
        <Text style={styles.sub}>فريق آمر 7 متاح للإجابة على استفساراتكم</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('tel:920017083')}>
          <View style={[styles.iconBox, { backgroundColor: '#E8F4F4' }]}>
            <Text style={styles.icon}>📞</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>اتصال مباشر</Text>
            <Text style={styles.cardVal}>920017083</Text>
          </View>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('https://wa.me/966505336956')}>
          <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.icon}>💬</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>واتساب الأعمال</Text>
            <Text style={styles.cardVal}>050 533 6956</Text>
          </View>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('mailto:info@amr-7.sa')}>
          <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.icon}>📧</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>البريد الإلكتروني</Text>
            <Text style={styles.cardVal}>info@amr-7.sa</Text>
          </View>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.contactCard}>
          <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
            <Text style={styles.icon}>📍</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>الموقع</Text>
            <Text style={styles.cardVal}>الرياض - حي النفل</Text>
            <Text style={styles.cardSub}>طريق أبوبكر الصديق</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>روابط سريعة</Text>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://amr-7.sa')}>
          <Text style={styles.linkArrow}>←</Text>
          <Text style={styles.linkText}>خدمات تأسيس الشركات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://pdf.amr7.io/privacy')}>
          <Text style={styles.linkArrow}>←</Text>
          <Text style={styles.linkText}>سياسة الخصوصية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://pdf.amr7.io/faq')}>
          <Text style={styles.linkArrow}>←</Text>
          <Text style={styles.linkText}>الأسئلة الشائعة</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legalBox}>
        <Text style={styles.legalText}>جميع الحقوق محفوظة © 2026 آمر سبعة لحلول الأعمال</Text>
        <Text style={styles.legalText}>سجل تجاري: 7041008108</Text>
        <Text style={styles.legalText}>الرقم الضريبي: 310892748800003</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { alignItems: 'center', paddingTop: 65, paddingBottom: 24, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  logo: { width: 140, height: 50, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '900', color: theme.colors.text },
  sub: { fontSize: 13, color: theme.colors.textMuted, marginTop: 6 },
  section: { backgroundColor: theme.colors.surface, marginHorizontal: 16, marginTop: 16, borderRadius: theme.radius.lg, padding: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, textAlign: 'right', marginBottom: 8 },
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: theme.colors.background, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  icon: { fontSize: 22 },
  cardText: { flex: 1, alignItems: 'flex-end' },
  cardTitle: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '600' },
  cardVal: { fontSize: 15, fontWeight: '800', color: theme.colors.text, marginTop: 2 },
  cardSub: { fontSize: 11, color: theme.colors.textMuted, marginTop: 1 },
  arrow: { fontSize: 16, color: theme.colors.primary, marginRight: 4 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  linkText: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  linkArrow: { fontSize: 14, color: theme.colors.primary },
  legalBox: { margin: 16, padding: 16, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', gap: 4 },
  legalText: { fontSize: 11, color: theme.colors.textMuted, textAlign: 'center' },
});
