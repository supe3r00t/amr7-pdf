import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    I18nManager,
    Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.brandDeep,
        paddingHorizontal: 20,
        paddingBottom: 16,
        marginHorizontal: 14,
        marginTop: 8,
        borderRadius: 26,
        overflow: 'hidden',
        ...theme.shadow.lg,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: theme.radius.md,
        backgroundColor: 'rgba(255,255,255,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.16)',
    },
    headerTitle: {
        fontSize: 18,
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
    },
    content: {
        paddingTop: 24,
        paddingHorizontal: 20,
    },
    heroBox: {
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    heroIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: theme.colors.surface,
        ...theme.shadow.sm,
    },
    heroTitle: {
        fontSize: 22,
        color: theme.colors.text,
        fontFamily: theme.fonts.black,
        marginBottom: 10,
        textAlign: 'center',
    },
    heroDesc: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
        lineHeight: 24,
    },
    accordionContainer: {
        gap: 12,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        overflow: 'hidden',
        ...theme.shadow.sm,
        shadowOpacity: 0.03,
    },
    cardExpanded: {
        borderColor: theme.colors.primaryLight,
        ...theme.shadow.md,
        shadowOpacity: 0.06,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: theme.colors.surface,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBoxActive: {
        backgroundColor: theme.colors.primary,
    },
    cardTitle: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    cardTitleActive: {
        color: theme.colors.primaryDark,
        fontFamily: theme.fonts.black,
    },
    cardBody: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 4,
        backgroundColor: theme.colors.surface,
    },
    bodyText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        lineHeight: 26,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    highlightText: {
        fontFamily: theme.fonts.bold,
        color: theme.colors.primaryDark,
        backgroundColor: theme.colors.primarySoft,
    },
    listContainer: {
        marginTop: 8,
        gap: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        paddingRight: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
        marginTop: 10,
    },
    listText: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        lineHeight: 24,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    footer: {
        marginTop: 40,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: 20,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLabel: {
        fontSize: 13,
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.medium,
    },
    footerValue: {
        fontSize: 13,
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
    },
    contactBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: theme.colors.primarySoft,
        paddingVertical: 14,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.primaryLight,
    },
    contactBtnText: {
        fontSize: 14,
        color: theme.colors.primaryDark,
        fontFamily: theme.fonts.bold,
    },
});

interface PolicySection {
    id: string;
    icon: any;
    title: string;
    content: React.ReactNode;
}

const POLICY_DATA: PolicySection[] = [
    {
        id: '1',
        icon: 'card-account-details-outline',
        title: 'جمع البيانات الشخصية',
        content: (
            <Text style={styles.bodyText}>
                نحن نجمع فقط المعلومات الضرورية لتقديم خدماتنا. قد يشمل ذلك معلومات التسجيل الأساسية (مثل البريد الإلكتروني والاسم) في حال قمت بإنشاء حساب، بالإضافة إلى بيانات الاستخدام الفنية (مثل عنوان IP، ونوع الجهاز) لتحسين أداء التطبيق.
            </Text>
        ),
    },
    {
        id: '2',
        icon: 'file-lock-outline',
        title: 'معالجة الملفات المرفوعة',
        content: (
            <Text style={styles.bodyText}>
                الملفات التي تقوم برفعها لمعالجتها (مثل الدمج، التقسيم، التحويل) يتم رفعها عبر اتصال مشفر (TLS/SSL). <Text style={styles.highlightText}>لا تعتبر هذه الملفات جزءاً من بياناتك الشخصية المخزنة لدينا</Text>. نحن لا نفتحها ولا ننسخها، ويتم <Text style={styles.highlightText}>حذفها تلقائياً ونهائياً</Text> من خوادمنا بعد مدة أقصاها ساعتين من انتهاء المعالجة.
            </Text>
        ),
    },
    {
        id: '3',
        icon: 'share-off-outline',
        title: 'مشاركة البيانات',
        content: (
            <Text style={styles.bodyText}>
                خصوصيتك أمانة. نحن <Text style={styles.highlightText}>لا نبيع، ولا نؤجر، ولا نشارك</Text> بياناتك الشخصية مع أطراف خارجية لأغراض تسويقية. يقتصر تبادل بعض البيانات المشفرة مع مزودي الخدمات الموثوقين فقط لإتمام الخدمات التي تطلبها داخل التطبيق.
            </Text>
        ),
    },
    {
        id: '4',
        icon: 'shield-account-outline',
        title: 'حقوق المستخدم',
        content: (
            <View style={styles.listContainer}>
                <Text style={styles.bodyText}>يحق لك كمستخدم لمنصتنا التمتع بالحقوق التالية:</Text>
                <View style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>معرفة البيانات التي تم جمعها عنك.</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>طلب تصحيح أو تحديث معلوماتك الشخصية.</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>طلب حذف حسابك وكافة بياناتك المسجلة لدينا بشكل نهائي.</Text>
                </View>
            </View>
        ),
    },
    {
        id: '5',
        icon: 'update',
        title: 'التعديلات على السياسة',
        content: (
            <Text style={styles.bodyText}>
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في خدماتنا أو استجابة للمتطلبات القانونية. استمرارك في استخدام التطبيق يعد موافقة صريحة على هذه التغييرات.
            </Text>
        ),
    },
];

export default function PrivacyScreen() {
    const insets = useSafeAreaInsets();
    const [expandedId, setExpandedId] = useState<string | null>('2');

    const toggleSection = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEmailPress = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await Linking.openURL('mailto:privacy@amr-7.sa');
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons
                        name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
                        size={22}
                        color={theme.colors.white}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>سياسة الخصوصية</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroBox}>
                    <View style={styles.heroIconWrapper}>
                        <MaterialCommunityIcons name="file-document-check-outline" size={42} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.heroTitle}>التزامنا تجاه بياناتك</Text>
                    <Text style={styles.heroDesc}>
                        نحن في &quot;آمر 7&quot; نؤمن بالشفافية التامة في كيفية التعامل مع بياناتك. توضح هذه السياسة كيف نجمع ونحمي معلوماتك عند استخدامك لأدواتنا.
                    </Text>
                </View>

                <View style={styles.accordionContainer}>
                    {POLICY_DATA.map((section) => {
                        const isExpanded = expandedId === section.id;
                        return (
                            <View key={section.id} style={[styles.card, isExpanded && styles.cardExpanded]}>
                                <TouchableOpacity
                                    style={styles.cardHeader}
                                    onPress={() => toggleSection(section.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.cardHeaderLeft}>
                                        <View style={[styles.iconBox, isExpanded && styles.iconBoxActive]}>
                                            <MaterialCommunityIcons
                                                name={section.icon}
                                                size={22}
                                                color={isExpanded ? '#fff' : theme.colors.primaryDark}
                                            />
                                        </View>
                                        <Text style={[styles.cardTitle, isExpanded && styles.cardTitleActive]}>
                                            {section.title}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name={isExpanded ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color={isExpanded ? theme.colors.primary : theme.colors.textMuted}
                                    />
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.cardBody}>
                                        {section.content}
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <View style={styles.footerRow}>
                        <Text style={styles.footerLabel}>آخر تحديث:</Text>
                        <Text style={styles.footerValue}>مارس 2026</Text>
                    </View>

                    <TouchableOpacity style={styles.contactBtn} onPress={handleEmailPress} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="email-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.contactBtnText}>للتواصل: info@amr-7.sa</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}
