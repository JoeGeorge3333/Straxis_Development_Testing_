import { Platform, Pressable, Text } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  const ios = Platform.OS === "ios";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: ios ? 16 : 14,
        paddingHorizontal: ios ? 18 : 16,
        minHeight: ios ? 48 : 44,
        justifyContent: "center",
        borderRadius: ios ? 16 : 14,
        backgroundColor: theme.colors.primary,
        opacity: pressed ? 0.86 : 1,
      })}
    >
      <Text style={{ color: theme.colors.onPrimary, fontWeight: "800", textAlign: "center" }}>
        {title}
      </Text>
    </Pressable>
  );
}

