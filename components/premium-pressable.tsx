import { PropsWithChildren, useRef } from 'react';
import {
    Animated,
    GestureResponderEvent,
    Pressable,
    PressableProps,
    StyleProp,
    ViewStyle,
} from 'react-native';

type PremiumPressableProps = PropsWithChildren<
    PressableProps & {
        style?: StyleProp<ViewStyle>;
        pressedScale?: number;
    }
>;

export function PremiumPressable({
    children,
    style,
    pressedScale = 0.98,
    onPressIn,
    onPressOut,
    ...props
}: PremiumPressableProps) {
    const scale = useRef(new Animated.Value(1)).current;

    const animateTo = (value: number) => {
        Animated.spring(scale, {
            toValue: value,
            useNativeDriver: true,
            speed: 28,
            bounciness: 4,
        }).start();
    };

    const handlePressIn = (event: GestureResponderEvent) => {
        animateTo(pressedScale);
        onPressIn?.(event);
    };

    const handlePressOut = (event: GestureResponderEvent) => {
        animateTo(1);
        onPressOut?.(event);
    };

    return (
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
            <Animated.View style={[style, { transform: [{ scale }] }]}>
                {children}
            </Animated.View>
        </Pressable>
    );
}
