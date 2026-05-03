import { Image, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

const LOGO = require('@/assets/images/logo-new.png');

type BrandMarkProps = {
    size?: number;
    glow?: boolean;
    style?: StyleProp<ViewStyle>;
};

export function BrandMark({ size = 44, glow, style }: BrandMarkProps) {
    return (
        <View
            style={[
                styles.wrap,
                {
                    borderRadius: size * 0.26,
                    height: size,
                    width: size,
                },
                glow && styles.glow,
                style,
            ]}
        >
            <Image
                source={LOGO}
                style={{ width: size, height: size, borderRadius: size * 0.26 }}
                resizeMode="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: theme.colors.brandDeep,
        overflow: 'hidden',
    },
    glow: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 8,
    },
});
