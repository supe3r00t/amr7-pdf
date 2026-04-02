import { Tabs } from 'expo-router';
import { theme } from '@/constants/theme';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        height: 70,
        paddingBottom: 12,
        paddingTop: 6,
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textMuted,
      tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'الرئيسية', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text> }} />
      <Tabs.Screen name="tools" options={{ title: 'الأدوات', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📄</Text> }} />
      <Tabs.Screen name="ai" options={{ title: 'الذكاء الاصطناعي', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🤖</Text> }} />
      <Tabs.Screen name="about" options={{ title: 'من نحن', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>ℹ️</Text> }} />
      <Tabs.Screen name="contact" options={{ title: 'تواصل', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📞</Text> }} />
    </Tabs>
  );
}
