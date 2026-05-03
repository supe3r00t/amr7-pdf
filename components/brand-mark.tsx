import { Image, StyleSheet } from 'react-native';
import type { ImageStyle, StyleProp } from 'react-native';
import { theme } from '@/constants/theme';

const LOGO = require('@/assets/images/logo-new.png');

type BrandMarkProps = {
    size?: number;
    glow?: boolean;
    style?: StyleProp<ImageStyle>;
};

/**
 * Renders the AMR7 logo image directly (no wrapper container) so the mark
 * floats on the canvas as the brand identity. `glow` adds a teal halo.
 */
export function BrandMark({ size = 44, glow, style }: BrandMarkProps) {
    return (
        <Image
            source={LOGO}
            style={[
                {
                    height: size,
                    width: size,
                    borderRadius: size * 0.26,
                },
                glow && styles.glow,
                style,
            ]}
            resizeMode="cover"
        />
    );
}

const styles = StyleSheet.create({
    glow: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.55,
        shadowRadius: 32,
        elevation: 14,
    },
});
