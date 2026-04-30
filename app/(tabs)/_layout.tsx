import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function TabsLayout() {
    // دالة لإضافة اهتزاز خفيف عند الضغط لتعزيز الإحساس بالجودة
    const hapticFeedback = {
        tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true, // منع الشريط من القفز فوق الكيبورد
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.borderLight,
                    borderTopWidth: 1,
                    height: Platform.OS === 'ios' ? 86 : 70,
                    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
                    paddingTop: 8,
                    paddingHorizontal: 10,
                    direction: 'rtl',
                    shadowColor: theme.colors.brandDeep,
                    shadowOffset: { width: 0, height: -8 },
                    shadowOpacity: 0.06,
                    shadowRadius: 18,
                    elevation: 8,
                },
                tabBarItemStyle: {
                    borderRadius: 16,
                    marginHorizontal: 3,
                    minHeight: 48,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarActiveBackgroundColor: theme.colors.primarySoft,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontFamily: theme.fonts.black,
                    marginTop: 3,
                },
                tabBarIconStyle: {
                    marginTop: 2,
                },
            }}
        >
            {/* الترتيب هنا سيتم قراءته من اليمين لليسار بفضل خاصية direction أعلاه */}
            <Tabs.Screen
                name="index"
                listeners={hapticFeedback}
                options={{
                    title: 'الرئيسية',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tools"
                listeners={hapticFeedback}
                options={{
                    title: 'الأدوات',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="ai"
                listeners={hapticFeedback}
                options={{
                    title: 'آمر AI', // إعطاء شخصية للمساعد الذكي بدلاً من كلمة "الذكاء" الجامدة
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'robot-outline' : 'robot-outline'}
                            size={25}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="about"
                listeners={hapticFeedback}
                options={{
                    title: 'المنصة', // أكثر احترافية من "من نحن"
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'information-circle' : 'information-circle-outline'}
                            size={25}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="contact"
                listeners={hapticFeedback}
                options={{
                    title: 'المساعدة', // تتوافق مع "مركز المساعدة" التي صممناها سابقاً
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'headset' : 'headset-outline'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
