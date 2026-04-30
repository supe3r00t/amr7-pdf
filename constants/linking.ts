import { Linking, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';

/**
 * دالة مركزية لفتح الروابط بذكاء (SaaS Grade)
 * @param url الرابط المراد فتحه
 * @param useInAppBrowser فتح روابط الويب داخل التطبيق (افتراضي: نعم)
 */
export const openURL = async (url: string, useInAppBrowser: boolean = true) => {
    try {
        // 1. تفاعل حسي مركزي (نبضة خفيفة عند الضغط على أي رابط)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // 2. فلترة الروابط التي يجب أن تفتح في تطبيقاتها الأصلية إجبارياً (Deep Links Bypass)
        const isNativeAppUrl =
            url.includes('wa.me') ||
            url.includes('api.whatsapp.com') ||
            url.includes('twitter.com') ||
            url.includes('x.com') ||
            url.includes('instagram.com') ||
            url.includes('linkedin.com');

        // 3. فتح روابط الويب العادية داخل التطبيق (Premium UX)
        if (useInAppBrowser && !isNativeAppUrl && (url.startsWith('http://') || url.startsWith('https://'))) {
            await WebBrowser.openBrowserAsync(url, {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET, // شكل السحب من الأسفل في iOS
                toolbarColor: theme.colors.surface,
                controlsColor: theme.colors.primary, // تلوين أزرار المتصفح بهوية التطبيق
            });
            return;
        }

        // 4. للروابط المستثناة وتطبيقات النظام (tel:, mailto:, sms:)
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            // تفاعل حسي للخطأ
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('عذراً', 'لا يوجد تطبيق مثبت في جهازك يدعم فتح هذا الرابط.');
        }
    } catch (error) {
        // 5. معالجة الأخطاء بشكل أنيق
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        console.error('Error opening URL:', error);
        Alert.alert('خطأ', 'حدثت مشكلة غير متوقعة أثناء محاولة فتح الرابط.');
    }
};