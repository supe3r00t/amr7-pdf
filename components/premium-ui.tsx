import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PremiumPressable } from '@/components/premium-pressable';
import { theme } from '@/constants/theme';

const RTL_ALIGN: TextStyle['textAlign'] = I18nManager.isRTL ? 'right' : 'left';

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
    subtitle?: string;
    eyebrow?: string;
    icon?: string;
    trailing?: ReactNode;
    showBack?: boolean;
    onBack?: () => void;
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
};

type SectionHeaderProps = {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: StyleProp<ViewStyle>;
};

type ChipProps = {
    label: string;
    active?: boolean;
    onPress?: () => void;
    icon?: string;
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
                    size={18}
                    color={isPrimary ? theme.colors.white : theme.colors.primary}
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
    subtitle,
    eyebrow,
    icon,
    trailing,
    showBack,
    onBack,
    children,
    style,
}: AppHeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.header,
                {
                    paddingTop: Math.max(insets.top, 12) + 8,
                },
                style,
            ]}
        >
            <View style={styles.headerRow}>
                {showBack && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBack}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons
                            name={I18nManager.isRTL ? 'chevron-forward' : 'chevron-back'}
                            size={22}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                )}

                <View style={styles.headerCopy}>
                    {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
                    <Text style={styles.headerTitle}>{title}</Text>
                    {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
                </View>

                {trailing ? (
                    trailing
                ) : icon ? (
                    <View style={styles.headerIconBox}>
                        <MaterialCommunityIcons
                            name={icon as any}
                            size={20}
                            color={theme.colors.primary}
                        />
                    </View>
                ) : null}
            </View>

            {children && <View style={styles.headerChildren}>{children}</View>}
        </View>
    );
}

export function SectionHeader({ title, actionLabel, onAction, style }: SectionHeaderProps) {
    return (
        <View style={[styles.sectionHeader, style]}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {actionLabel && (
                <TouchableOpacity onPress={onAction} activeOpacity={0.7} style={styles.sectionAction}>
                    <Text style={styles.sectionActionText}>{actionLabel}</Text>
                    <Ionicons
                        name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={14}
                        color={theme.colors.primary}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

export function Chip({ label, active, onPress, icon }: ChipProps) {
    return (
        <TouchableOpacity
            style={[styles.chip, active && styles.chipActive]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {icon && (
                <MaterialCommunityIcons
                    name={icon as any}
                    size={14}
                    color={active ? theme.colors.white : theme.colors.textSecondary}
                />
            )}
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
        </TouchableOpacity>
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
        borderRadius: theme.radius.md,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        minHeight: 50,
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    buttonPrimary: {
        backgroundColor: theme.colors.primary,
        ...theme.shadow.sm,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.borderBrand,
        borderWidth: 1,
    },
    buttonGhost: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
    },
    buttonDisabled: {
        opacity: 0.55,
    },
    buttonText: {
        ...theme.type.button,
        textAlign: 'center',
    },
    buttonTextPrimary: {
        color: theme.colors.white,
    },
    buttonTextSecondary: {
        color: theme.colors.primary,
    },

    /* --- Header --- */
    header: {
        backgroundColor: theme.colors.background,
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    headerRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
    },
    backButton: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    headerCopy: {
        alignItems: 'flex-start',
        flex: 1,
    },
    eyebrow: {
        ...theme.type.eyebrow,
        color: theme.colors.primary,
        marginBottom: 4,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    headerTitle: {
        ...theme.type.h1,
        color: theme.colors.text,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    headerSubtitle: {
        ...theme.type.body,
        color: theme.colors.textMuted,
        marginTop: 4,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    headerIconBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.borderBrand,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    headerChildren: {
        marginTop: 16,
    },

    /* --- Section header --- */
    sectionHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    sectionTitle: {
        ...theme.type.h3,
        color: theme.colors.text,
        textAlign: RTL_ALIGN,
        writingDirection: 'rtl',
    },
    sectionAction: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    sectionActionText: {
        ...theme.type.captionStrong,
        color: theme.colors.primary,
    },

    /* --- Chip --- */
    chip: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 6,
        height: 36,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    chipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        ...theme.type.captionStrong,
        color: theme.colors.textSecondary,
    },
    chipTextActive: {
        color: theme.colors.white,
    },
});
