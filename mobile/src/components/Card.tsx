import { Platform, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export function Card({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const ios = Platform.OS === "ios";
  return (
    <View
      style={{
        borderRadius: ios ? 20 : 18,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        padding: ios ? 16 : 14,
      }}
    >
      {children}
    </View>
  );
}

