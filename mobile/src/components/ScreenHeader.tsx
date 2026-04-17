import { Text, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 28,
          fontWeight: "800",
          letterSpacing: 0.2,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ color: theme.colors.muted, fontSize: 14, lineHeight: 20 }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

