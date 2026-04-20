import { Platform, Text, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const theme = useTheme();
  const ios = Platform.OS === "ios";
  return (
    <View style={{ gap: ios ? 8 : 6 }}>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: ios ? 30 : 28,
          fontWeight: "800",
          letterSpacing: ios ? 0.15 : 0.2,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: theme.colors.muted,
            fontSize: ios ? 15 : 14,
            lineHeight: ios ? 22 : 20,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

