import { Pressable, Text } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        opacity: pressed ? 0.86 : 1,
      })}
    >
      <Text style={{ color: "#05110C", fontWeight: "800", textAlign: "center" }}>
        {title}
      </Text>
    </Pressable>
  );
}

