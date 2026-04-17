import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Avatar } from "@/components/Avatar";
import { useTheme } from "@/theme/ThemeProvider";

export function MatchupHeader({
  dayNumber,
  streakDays,
  profileName,
  onOpenCalendar,
}: {
  dayNumber: number;
  streakDays: number;
  profileName: string;
  onOpenCalendar: () => void;
}) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Avatar seed={profileName} size={44} />

      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            color: theme.colors.primary,
            fontSize: 12,
            fontWeight: "800",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Streak / Day
        </Text>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
          <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: "900" }}>
            Day {dayNumber}
          </Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
            {streakDays} day streak
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onOpenCalendar}
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface2,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.86 : 1,
        })}
        accessibilityLabel="Open streak calendar"
      >
        <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}

