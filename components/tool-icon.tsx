import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Tool } from '@/constants/tools';
import { theme } from '@/constants/theme';

interface ToolIconProps {
  tool: Tool;
  size?: number;
  color?: string;
}

export function ToolIcon({ tool, size = 24, color }: ToolIconProps) {
  const iconColor = color ?? theme.colors.primary;

  if (tool.iconSet === 'MaterialCommunityIcons') {
    return (
      <MaterialCommunityIcons
        name={tool.iconName as any}
        size={size}
        color={iconColor}
      />
    );
  }

  return (
    <Ionicons
      name={tool.iconName as any}
      size={size}
      color={iconColor}
    />
  );
}