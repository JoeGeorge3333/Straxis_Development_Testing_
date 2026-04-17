import { View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export function ProgressBar({ value }: { value: number }) {
  const theme = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      style={{
        height: 10,
        borderRadius: 999,
        backgroundColor: theme.colors.surface2,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.round(pct * 100)}%`,
          height: "100%",
          backgroundColor: theme.colors.primary2,
        }}
      />
    </View>
  );
}

