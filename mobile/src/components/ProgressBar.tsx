import { View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

/** `value` = your share of combined points (0–1). Two-tone matchup track (gold / ember). */
export function ProgressBar({ value }: { value: number }) {
  const theme = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  const leftPct = Math.round(pct * 100);

  return (
    <View
      style={{
        height: 10,
        borderRadius: 999,
        backgroundColor: theme.colors.surface2,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          width: `${leftPct}%`,
          height: "100%",
          backgroundColor: theme.colors.primary,
        }}
      />
      <View
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: theme.colors.ember,
          opacity: 0.92,
        }}
      />
    </View>
  );
}
