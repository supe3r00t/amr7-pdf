import type { TextStyle, ViewStyle } from 'react-native';

export type ThemeColors = {
    primary: string;
    primaryHover: string;
    primaryDark: string;
    primaryMid: string;
    primaryLight: string;
    primarySoft: string;
    accent: string;
    brandDeep: string;
    brandInk: string;
    heroText: string;
    background: string;
    surface: string;
    card: string;
    surfaceAlt: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    textPlaceholder: string;
    border: string;
    borderLight: string;
    borderFocus: string;
    borderBrand: string;
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
    danger: string;
    dangerBg: string;
    disabled: string;
    disabledBg: string;
    white: string;
    overlay: string;
};

export type ThemeFonts = {
    regular: TextStyle['fontFamily'];
    medium: TextStyle['fontFamily'];
    bold: TextStyle['fontFamily'];
    black: TextStyle['fontFamily'];
};

export type ThemeRadii = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
};

export type ThemeSpacing = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
};

export type ThemeShadows = {
    sm: ViewStyle;
    md: ViewStyle;
    lg: ViewStyle;
};

const lightColors: ThemeColors = {
    primary: '#1FA7A2',
    primaryHover: '#188C88',
    primaryDark: '#0A2540',
    primaryMid: '#168D89',
    primaryLight: '#8EDCEF',
    primarySoft: '#E8F8FB',
    accent: '#8EDCEF',
    brandDeep: '#0A2540',
    brandInk: '#061A2E',
    heroText: '#E8ECEF',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    surfaceAlt: '#EEF3F7',
    text: '#10243A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    textPlaceholder: '#94A3B8',
    border: '#DDE6EE',
    borderLight: '#E7EDF3',
    borderFocus: 'rgba(31, 167, 162, 0.36)',
    borderBrand: 'rgba(31, 167, 162, 0.24)',
    success: '#22C55E',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningBg: '#FFFBEB',
    danger: '#EF4444',
    dangerBg: '#FEF2F2',
    disabled: '#94A3B8',
    disabledBg: '#E2E8F0',
    white: '#FFFFFF',
    overlay: 'rgba(16, 33, 43, 0.35)',
};

const darkColors: ThemeColors = {
    primary: '#14B8A6',
    primaryHover: '#2DD4BF',
    primaryDark: '#CCFBF1',
    primaryMid: '#0D9488',
    primaryLight: 'rgba(45, 212, 191, 0.24)',
    primarySoft: 'rgba(45, 212, 191, 0.13)',
    accent: '#5EEAD4',
    brandDeep: '#031F22',
    brandInk: '#061B24',
    heroText: '#EFFFFD',
    background: '#0B141A',
    surface: '#10212B',
    card: '#10212B',
    surfaceAlt: '#172A35',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    textPlaceholder: '#64748B',
    border: '#243846',
    borderLight: '#243846',
    borderFocus: 'rgba(107, 200, 190, 0.38)',
    borderBrand: 'rgba(107, 200, 190, 0.25)',
    success: '#4ADE80',
    successBg: 'rgba(34, 197, 94, 0.14)',
    warning: '#FBBF24',
    warningBg: 'rgba(245, 158, 11, 0.14)',
    danger: '#F87171',
    dangerBg: 'rgba(239, 68, 68, 0.14)',
    disabled: '#64748B',
    disabledBg: '#243846',
    white: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.55)',
};

const fonts: ThemeFonts = {
    regular: 'Tajawal_400Regular',
    medium: 'Tajawal_500Medium',
    bold: 'Tajawal_700Bold',
    black: 'Tajawal_900Black',
};

const radius: ThemeRadii = {
    xs: 8,
    sm: 10,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
};

const spacing: ThemeSpacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
};

const shadow: ThemeShadows = {
    sm: {
        shadowColor: lightColors.text,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 2,
    },
    md: {
        shadowColor: lightColors.brandDeep,
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.10,
        shadowRadius: 24,
        elevation: 4,
    },
    lg: {
        shadowColor: lightColors.brandDeep,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 34,
        elevation: 8,
    },
};

export const theme = {
    colors: lightColors,
    darkColors,
    colorSchemes: {
        light: lightColors,
        dark: darkColors,
    },
    fonts,
    radius,
    spacing,
    shadow,
} as const;

export const Colors = {
    light: {
        text: lightColors.text,
        background: lightColors.background,
        tint: lightColors.primary,
        icon: lightColors.textMuted,
        tabIconDefault: lightColors.textMuted,
        tabIconSelected: lightColors.primary,
    },
    dark: {
        text: darkColors.text,
        background: darkColors.background,
        tint: darkColors.primary,
        icon: darkColors.textMuted,
        tabIconDefault: darkColors.textMuted,
        tabIconSelected: darkColors.primary,
    },
} as const;
