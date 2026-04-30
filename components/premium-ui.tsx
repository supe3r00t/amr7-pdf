import type { ReactNode } from 'react';
import type { ImageSourcePropType, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { I18nManager, Image, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PremiumPressable } from '@/components/premium-pressable';
import { theme } from '@/constants/theme';

type PremiumCardProps = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
};

type PremiumButtonProps = PressableProps & {
    title: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

type AppHeaderProps = {
    title: string;
    eyebrow?: string;
    subtitle?: string;
    icon?: string;
    logoSource?: ImageSourcePropType;
    trailing?: ReactNode;
    children?: ReactNode;
    compact?: boolean;
    style?: StyleProp<ViewStyle>;
};

export function PremiumCard({ children, style }: PremiumCardProps) {
    return <View style={[styles.card, style]}>{children}</View>;
}

export function PremiumButton({
    title,
    icon,
    variant = 'primary',
    style,
    textStyle,
    disabled,
    ...props
}: PremiumButtonProps) {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';

    return (
        <PremiumPressable
            pressedScale={0.985}
            style={[
                styles.button,
                isPrimary && styles.buttonPrimary,
                isSecondary && styles.buttonSecondary,
                variant === 'ghost' && styles.buttonGhost,
                disabled && styles.buttonDisabled,
                style,
            ]}
            disabled={disabled}
            {...props}
        >
            {icon && (
                <MaterialCommunityIcons
                    name={icon as any}
                    size={20}
                    color={isPrimary ? theme.colors.white : theme.colors.primaryDark}
                />
            )}
            <Text
                style={[
                    styles.buttonText,
                    isPrimary ? styles.buttonTextPrimary : styles.buttonTextSecondary,
                    textStyle,
                ]}
            >
                {title}
            </Text>
        </PremiumPressable>
    );
}

export function AppHeader({
    title,
    eyebrow,
    subtitle,
    icon,
    logoSource,
    trailing,
    children,
    compact,
    style,
}: AppHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.header,
                {
                    paddingTop: Math.max(insets.top, 20) + (compact ? 12 : 18),
                    paddingBottom: compact ? 20 : 26,
                },
                style,
            ]}
        >
            <View style={styles.headerAccent} />
            <View style={styles.headerTop}>
                <View style={styles.headerCopy}>
                    {eyebrow && (
                        <View style={styles.eyebrowPill}>
                            <MaterialCommunityIcons name="shield-check-outline" size={13} color={theme.colors.accent} />
                            <Text style={styles.eyebrowText}>{eyebrow}</Text>
                        </View>
                    )}

                    {logoSource ? (
                        <Image source={logoSource} style={styles.headerLogo} resizeMode="contain" />
                    ) : (
                        <Text style={styles.headerTitle}>{title}</Text>
                    )}

                    {logoSource && <Text style={styles.headerTitleCompact}>{title}</Text>}
                    {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
                </View>

                {trailing ? (
                    trailing
                ) : icon ? (
                    <View style={styles.headerIconBox}>
                        <MaterialCommunityIcons name={icon as any} size={28} color={theme.colors.accent} />
                    </View>
                ) : null}
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        ...theme.shadow.sm,
    },
    button: {
        alignItems: 'center',
        borderRadius: 18,
        flexDirection: 'row',
        gap: 9,
        justifyContent: 'center',
        minHeight: 54,
        paddingHorizontal: 18,
        paddingVertical: 15,
    },
    buttonPrimary: {
        backgroundColor: theme.colors.primary,
        ...theme.shadow.md,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.primaryLight,
        borderWidth: 1,
    },
    buttonGhost: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
    },
    buttonDisabled: {
        opacity: 0.65,
    },
    buttonText: {
        fontFamily: theme.fonts.black,
        fontSize: 15,
        textAlign: 'center',
    },
    buttonTextPrimary: {
        color: theme.colors.white,
    },
    buttonTextSecondary: {
        color: theme.colors.primaryDark,
    },
    header: {
        backgroundColor: theme.colors.brandDeep,
        borderColor: 'rgba(255,255,255,0.10)',
        borderRadius: 28,
        borderWidth: 1,
        marginHorizontal: 14,
        marginTop: 8,
        overflow: 'hidden',
        paddingHorizontal: 20,
        ...theme.shadow.lg,
    },
    headerAccent: {
        backgroundColor: theme.colors.primary,
        height: 3,
        left: 20,
        position: 'absolute',
        right: 20,
        top: 0,
    },
    headerTop: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'space-between',
    },
    headerCopy: {
        alignItems: 'flex-start',
        flex: 1,
    },
    eyebrowPill: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderColor: 'rgba(255,255,255,0.14)',
        borderRadius: theme.radius.full,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 6,
        marginBottom: 12,
        paddingHorizontal: 11,
        paddingVertical: 5,
    },
    eyebrowText: {
        color: theme.colors.heroText,
        fontFamily: theme.fonts.bold,
        fontSize: 12,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    headerLogo: {
        height: 48,
        marginBottom: 10,
        width: 160,
    },
    headerTitle: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 28,
        lineHeight: 36,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    headerTitleCompact: {
        color: theme.colors.white,
        fontFamily: theme.fonts.black,
        fontSize: 18,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    headerSubtitle: {
        color: 'rgba(232,236,239,0.78)',
        fontFamily: theme.fonts.medium,
        fontSize: 14,
        lineHeight: 23,
        marginTop: 8,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    headerIconBox: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderColor: 'rgba(255,255,255,0.14)',
        borderRadius: 18,
        borderWidth: 1,
        height: 56,
        justifyContent: 'center',
        width: 56,
    },
});
