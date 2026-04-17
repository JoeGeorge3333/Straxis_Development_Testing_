import { Text, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import type { LeaderboardRow } from "@/types/api";

export function LeaderboardRowItem({ row }: { row: LeaderboardRow }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ color: theme.colors.muted, width: 22, textAlign: "right" }}>
          {row.rank}
        </Text>
        <Avatar seed={row.profile.username} size={34} />
        <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
          {row.profile.username}
        </Text>
      </View>
      <Text style={{ color: theme.colors.text, fontWeight: "900" }}>
        {row.total_points} pts
      </Text>
    </View>
  );
}

