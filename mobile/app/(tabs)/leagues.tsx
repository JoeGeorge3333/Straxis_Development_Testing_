import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { LeaderboardRowItem } from "@/components/LeaderboardRowItem";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TextField } from "@/components/TextField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  joinLeagueThunk,
  refreshFeed,
  refreshLeaderboard,
  refreshLeagues,
} from "@/store/slices/leaguesSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { useTabScreenScrollStyle } from "@/theme/screenLayout";

export default function LeaguesScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { activeLeague, leaderboard, feed, isLoading, error } = useAppSelector(
    (s) => s.leagues
  );
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    dispatch(refreshLeagues());
  }, [dispatch]);

  useEffect(() => {
    if (!activeLeague?.id) return;
    dispatch(refreshLeaderboard(activeLeague.id));
    dispatch(refreshFeed(activeLeague.id));
  }, [dispatch, activeLeague?.id]);

  const scrollStyle = useTabScreenScrollStyle();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={scrollStyle}>
        <ScreenHeader title="League" subtitle="Standings and activity." />

        {!activeLeague ? (
          <Card>
            <View style={{ gap: 12 }}>
              <Text style={{ color: theme.colors.muted }}>
                Join a league with an invite code to start competing.
              </Text>
              <TextField
                label="Invite code"
                value={inviteCode}
                onChangeText={setInviteCode}
                placeholder="AB12CD34"
                autoCapitalize="characters"
              />
              {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
              <PrimaryButton
                title={isLoading ? "Joining..." : "Join league"}
                onPress={() => dispatch(joinLeagueThunk(inviteCode.trim().toUpperCase()))}
              />
            </View>
          </Card>
        ) : (
          <>
            <Card>
              <View style={{ gap: 6 }}>
                <Text style={{ color: theme.colors.primary, fontWeight: "900", letterSpacing: 1 }}>
                  {activeLeague.name}
                </Text>
                <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
                  Invite code: {activeLeague.invite_code} • Status: {activeLeague.status}
                </Text>
                <View style={{ height: 10 }} />
                <PrimaryButton
                  title="Refresh standings"
                  onPress={() => dispatch(refreshLeaderboard(activeLeague.id))}
                />
              </View>
            </Card>

            <Card>
              <Text style={{ color: theme.colors.text, fontWeight: "900", marginBottom: 6 }}>
                Leaderboard
              </Text>
              {leaderboard.length === 0 ? (
                <Text style={{ color: theme.colors.muted }}>No standings yet.</Text>
              ) : (
                <View>
                  {leaderboard.slice(0, 10).map((row) => (
                    <LeaderboardRowItem key={`${row.rank}-${row.profile.id}`} row={row} />
                  ))}
                </View>
              )}
            </Card>

            <Card>
              <Text style={{ color: theme.colors.text, fontWeight: "900", marginBottom: 6 }}>
                Activity feed
              </Text>
              {feed.length === 0 ? (
                <Text style={{ color: theme.colors.muted }}>No activity yet.</Text>
              ) : (
                <View style={{ gap: 10 }}>
                  {feed.slice(0, 6).map((item) => (
                    <View key={item.id} style={{ gap: 2 }}>
                      <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                        {item.actor.username}
                      </Text>
                      <Text style={{ color: theme.colors.muted }}>{item.message}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
