import type { ReactNode } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

type ScreenBackgroundProps = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    halo?: boolean;
};

const { width } = Dimensions.get('window');

/**
 * Wraps a screen with the AMR7 navy canvas. Layered translucent blooms
 * imitate a teal radial gradient without requiring a gradient library —
 * giving the screen branded depth and atmosphere instead of flat color.
 */
export function ScreenBackground({ children, style, halo = true }: ScreenBackgroundProps) {
    return (
        <View style={[styles.root, style]}>
            {/* Bottom navy wash for added depth */}
            <View pointerEvents="none" style={styles.bottomWash} />

            {halo && (
                <>
                    {/* Top-right primary bloom */}
                    <View pointerEvents="none" style={styles.glowTop} />
                    {/* Inner brighter teal core */}
                    <View pointerEvents="none" style={styles.glowTopCore} />
                    {/* Mid-left light teal accent */}
                    <View pointerEvents="none" style={styles.glowMid} />
                    {/* Bottom-right deep teal pool */}
                    <View pointerEvents="none" style={styles.glowBottom} />
                </>
            )}

            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: theme.colors.brandInk,
        flex: 1,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
    },
    bottomWash: {
        backgroundColor: theme.colors.brandDeep,
        bottom: 0,
        height: '52%',
        left: 0,
        opacity: 0.65,
        position: 'absolute',
        right: 0,
    },
    glowTop: {
        backgroundColor: 'rgba(31, 167, 162, 0.22)',
        borderRadius: 260,
        height: 420,
        position: 'absolute',
        right: -140,
        top: -200,
        width: 420,
    },
    glowTopCore: {
        backgroundColor: 'rgba(142, 220, 239, 0.14)',
        borderRadius: 140,
        height: 220,
        position: 'absolute',
        right: -40,
        top: -90,
        width: 220,
    },
    glowMid: {
        backgroundColor: 'rgba(142, 220, 239, 0.10)',
        borderRadius: 200,
        height: 320,
        left: -120,
        position: 'absolute',
        top: width * 0.55,
        width: 320,
    },
    glowBottom: {
        backgroundColor: 'rgba(31, 167, 162, 0.16)',
        borderRadius: 220,
        bottom: -180,
        height: 360,
        position: 'absolute',
        right: -120,
        width: 360,
    },
});
