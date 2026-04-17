import { View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export function Card({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View
      style={{
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        padding: 14,
      }}
    >
      {children}
    </View>
  );
}

