import { Text, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { ProgressBar } from "@/components/ProgressBar";
import { useTheme } from "@/theme/ThemeProvider";

type Side = {
  label: string;
  points: number;
  avatarSeed: string;
};

export function MatchupScoreCard({ left, right }: { left: Side; right: Side }) {
  const theme = useTheme();
  const total = Math.max(left.points + right.points, 1);
  const leftPct = left.points / total;

  return (
    <View
      style={{
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        padding: 14,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>You</Text>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "900" }}>
            {left.points} pts
          </Text>
        </View>
        <View style={{ gap: 4, alignItems: "flex-end" }}>
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>Opponent</Text>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "900" }}>
            {right.points} pts
          </Text>
        </View>
      </View>

      <ProgressBar value={leftPct} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 4,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Avatar seed={left.avatarSeed} size={46} />
          <View style={{ gap: 2 }}>
            <Text style={{ color: theme.colors.text, fontWeight: "800" }}>{left.label}</Text>
            <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{left.points} pts</Text>
          </View>
        </View>

        <Text style={{ color: theme.colors.muted, fontSize: 20, fontWeight: "900" }}>
          VS
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ gap: 2, alignItems: "flex-end" }}>
            <Text style={{ color: theme.colors.text, fontWeight: "800" }}>{right.label}</Text>
            <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{right.points} pts</Text>
          </View>
          <Avatar seed={right.avatarSeed} size={46} />
        </View>
      </View>
    </View>
  );
}

