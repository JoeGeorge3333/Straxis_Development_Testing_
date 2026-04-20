import { Platform, Text, TextInput, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
}: {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  const theme = useTheme();
  const ios = Platform.OS === "ios";
  return (
    <View style={{ gap: ios ? 10 : 8 }}>
      <Text style={{ color: theme.colors.muted, fontSize: 12, letterSpacing: 1 }}>
        {label.toUpperCase()}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={{
          color: theme.colors.text,
          backgroundColor: theme.colors.surface,
          borderRadius: ios ? 16 : 14,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingHorizontal: ios ? 16 : 14,
          paddingVertical: ios ? 14 : 12,
          minHeight: ios ? 48 : 44,
          fontSize: ios ? 17 : 16,
        }}
      />
    </View>
  );
}

