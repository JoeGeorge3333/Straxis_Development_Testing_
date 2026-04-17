import { Text, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({ seed, size }: { seed: string; size: number }) {
  const theme = useTheme();
  const h = hash(seed);
  const initials = seed
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  const tint = `hsl(${h % 360}, 70%, 55%)`;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.surface2,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      accessibilityLabel="Avatar"
    >
      <View
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.25,
          backgroundColor: tint,
        }}
      />
      <Text style={{ color: theme.colors.text, fontWeight: "900" }}>{initials || "U"}</Text>
    </View>
  );
}

