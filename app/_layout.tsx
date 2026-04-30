import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    useFonts,
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_900Black,
} from '@expo-google-fonts/tajawal';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';
import { I18nManager, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';

// إبقاء شاشة البداية ظاهرة حتى ننهي إعداداتنا
SplashScreen.preventAutoHideAsync().catch(() => {});

// فرض الاتجاه العربي بقوة قبل بدء دورة حياة التطبيق
try {
    if (!I18nManager.isRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
    }
} catch (e) {
    console.warn('Failed to force RTL', e);
}

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Tajawal_400Regular,
        Tajawal_500Medium,
        Tajawal_700Bold,
        Tajawal_900Black,
    });

    // دالة احترافية للتعامل مع إخفاء الـ Splash Screen
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            // تأخير مدروس بـ 150 ملي ثانية لضمان سلاسة الانتقال وعدم ظهور شاشة بيضاء
            setTimeout(async () => {
                await SplashScreen.hideAsync().catch(() => {});
            }, 150);
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        onLayoutRootView();
    }, [onLayoutRootView]);

    // إذا لم تحمل الخطوط ولم يظهر خطأ، لا تعرض شيئاً بعد
    if (!fontsLoaded && !fontError) {
        return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="dark" backgroundColor={theme.colors.background} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    // slide_from_left هو الأصح في الـ RTL لأن الشاشة الجديدة تأتي من الأمام (اليسار)
                    animation: 'slide_from_left',
                    gestureEnabled: true,
                    contentStyle: {
                        backgroundColor: theme.colors.background,
                        direction: 'rtl' // طبقة أمان إضافية لفرض الـ RTL على المحتوى
                    },
                }}
            />
        </SafeAreaProvider>
    );
}
