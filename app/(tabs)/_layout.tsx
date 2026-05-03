import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';

export default function TabsLayout() {
    const hapticFeedback = {
        tabPress: () => {
            Haptics.selectionAsync();
        },
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.borderLight,
                    borderTopWidth: 1,
                    height: Platform.OS === 'ios' ? 76 : 62,
                    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
                    paddingTop: 6,
                    paddingHorizontal: 4,
                    direction: 'rtl',
                    elevation: 0,
                    shadowColor: 'transparent',
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontFamily: theme.fonts.bold,
                    marginTop: 2,
                },
                tabBarIconStyle: {
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                listeners={hapticFeedback}
                options={{
                    title: 'الرئيسية',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tools"
                listeners={hapticFeedback}
                options={{
                    title: 'الأدوات',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'apps' : 'apps-outline'} size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="ai"
                listeners={hapticFeedback}
                options={{
                    title: 'آمر AI',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'auto-fix' : 'auto-fix'}
                            size={23}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="about"
                listeners={hapticFeedback}
                options={{
                    title: 'المنصة',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'information-circle' : 'information-circle-outline'}
                            size={23}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="contact"
                listeners={hapticFeedback}
                options={{
                    title: 'المساعدة',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={22} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
