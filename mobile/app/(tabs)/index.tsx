import { useEffect, useMemo } from "react";
import { SafeAreaView, ScrollView, useWindowDimensions, View } from "react-native";

import { MatchupHeader } from "@/components/MatchupHeader";
import { MatchupScoreCard } from "@/components/MatchupScoreCard";
import { TaskChecklist } from "@/components/TaskChecklist";
import { useAppDispatch } from "@/store/hooks";
import { useAppSelector } from "@/store/hooks";
import { refreshLeaderboard, refreshLeagues } from "@/store/slices/leaguesSlice";
import { useTheme } from "@/theme/ThemeProvider";

const WIDE_BREAKPOINT = 880;

export default function DashboardScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const wide = width >= WIDE_BREAKPOINT;
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.profile);
  const league = useAppSelector((s) => s.leagues.activeLeague);
  const todayScore = useAppSelector((s) => s.leagues.todayScore);
  const opponent = useAppSelector((s) => s.leagues.opponentSnapshot);

  useEffect(() => {
    dispatch(refreshLeagues());
  }, [dispatch]);

  useEffect(() => {
    if (league?.id) dispatch(refreshLeaderboard(league.id));
  }, [dispatch, league?.id]);

  const { mePoints, oppPoints } = useMemo(() => {
    const mePoints = todayScore?.mePoints ?? 215;
    const oppPoints = todayScore?.opponentPoints ?? 300;
    return { mePoints, oppPoints };
  }, [todayScore]);

  const header = (
    <MatchupHeader
      dayNumber={league?.dayNumber ?? 12}
      streakDays={league?.streakDays ?? 12}
      onOpenCalendar={() => {}}
      profileName={me?.username ?? "You"}
    />
  );

  const scoreCard = (
    <MatchupScoreCard
      left={{
        label: me?.username ?? "You",
        points: mePoints,
        avatarSeed: me?.username ?? "You",
      }}
      right={{
        label: opponent?.username ?? "Opponent",
        points: oppPoints,
        avatarSeed: opponent?.username ?? "Opponent",
      }}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{
          padding: wide ? 24 : 16,
          gap: 12,
          paddingBottom: 28,
          maxWidth: wide ? 1120 : undefined,
          width: "100%",
          alignSelf: wide ? "center" : undefined,
        }}
      >
        {wide ? (
          <View style={{ flexDirection: "row", gap: 20, alignItems: "flex-start" }}>
            <View style={{ flex: 1, gap: 12, minWidth: 0 }}>
              {header}
              {scoreCard}
            </View>
            <View style={{ flex: 1, minWidth: 0, maxWidth: 520 }}>
              <TaskChecklist />
            </View>
          </View>
        ) : (
          <>
            {header}
            {scoreCard}
            <View style={{ height: 6 }} />
            <TaskChecklist />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
