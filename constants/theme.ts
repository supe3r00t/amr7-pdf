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
    textOnDark: string;
    textOnDarkMuted: string;
    border: string;
    borderLight: string;
    borderOnDark: string;
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

export type ThemeType = {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    title: TextStyle;
    body: TextStyle;
    bodyStrong: TextStyle;
    caption: TextStyle;
    captionStrong: TextStyle;
    eyebrow: TextStyle;
    button: TextStyle;
};

const lightColors: ThemeColors = {
    primary: '#1FA7A2',
    primaryHover: '#188C88',
    primaryDark: '#0A2540',
    primaryMid: '#168D89',
    primaryLight: '#8EDCEF',
    primarySoft: '#EAF8F8',
    accent: '#8EDCEF',
    brandDeep: '#0A2540',
    brandInk: '#061A2E',
    heroText: '#E8ECEF',
    background: '#061A2E',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    surfaceAlt: '#F1F4F8',
    text: '#0A2540',
    textSecondary: '#3A4A5C',
    textMuted: '#6B7A8C',
    textPlaceholder: '#9AA7B5',
    textOnDark: '#FFFFFF',
    textOnDarkMuted: 'rgba(232, 236, 239, 0.74)',
    border: '#E2E8EE',
    borderLight: '#EEF2F6',
    borderOnDark: 'rgba(255, 255, 255, 0.10)',
    borderFocus: 'rgba(31, 167, 162, 0.36)',
    borderBrand: 'rgba(31, 167, 162, 0.22)',
    success: '#10B981',
    successBg: '#E8F8F2',
    warning: '#F59E0B',
    warningBg: '#FFF6E5',
    danger: '#EF4444',
    dangerBg: '#FEEDED',
    disabled: '#94A3B8',
    disabledBg: '#E2E8F0',
    white: '#FFFFFF',
    overlay: 'rgba(10, 37, 64, 0.32)',
};

const darkColors: ThemeColors = {
    primary: '#1FA7A2',
    primaryHover: '#2DD4BF',
    primaryDark: '#E8F8FB',
    primaryMid: '#0D9488',
    primaryLight: 'rgba(45, 212, 191, 0.24)',
    primarySoft: 'rgba(45, 212, 191, 0.13)',
    accent: '#8EDCEF',
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
    textOnDark: '#FFFFFF',
    textOnDarkMuted: 'rgba(232, 236, 239, 0.74)',
    border: '#243846',
    borderLight: '#243846',
    borderOnDark: 'rgba(255, 255, 255, 0.10)',
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
    md: 14,
    lg: 18,
    xl: 22,
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
        shadowColor: '#0A2540',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
    },
    md: {
        shadowColor: '#0A2540',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 3,
    },
    lg: {
        shadowColor: '#0A2540',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.10,
        shadowRadius: 28,
        elevation: 6,
    },
};

const type: ThemeType = {
    h1: { fontFamily: fonts.black, fontSize: 26, lineHeight: 34 },
    h2: { fontFamily: fonts.black, fontSize: 20, lineHeight: 28 },
    h3: { fontFamily: fonts.black, fontSize: 17, lineHeight: 24 },
    title: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 22 },
    body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22 },
    bodyStrong: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 22 },
    caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 18 },
    captionStrong: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 18 },
    eyebrow: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 16, letterSpacing: 0.4 },
    button: { fontFamily: fonts.black, fontSize: 15, lineHeight: 20 },
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
    type,
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
