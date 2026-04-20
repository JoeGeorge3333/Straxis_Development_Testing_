import { useEffect, useState } from "react";
import { Platform, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TextField } from "@/components/TextField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logWorkoutThunk, refreshWorkouts } from "@/store/slices/workoutsSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { useTabScreenScrollStyle } from "@/theme/screenLayout";

export default function WorkoutsScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((s) => s.workouts);
  const [duration, setDuration] = useState("45");
  const [notes, setNotes] = useState("");
  const [isOutdoor, setIsOutdoor] = useState(false);

  useEffect(() => {
    dispatch(refreshWorkouts());
  }, [dispatch]);

  async function onLog() {
    const duration_mins = Number(duration);
    if (!Number.isFinite(duration_mins) || duration_mins <= 0) return;
    await dispatch(
      logWorkoutThunk({
        duration_mins,
        is_outdoor: isOutdoor,
        notes: notes.trim() || undefined,
      })
    );
    setNotes("");
  }

  const scrollStyle = useTabScreenScrollStyle();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        contentContainerStyle={scrollStyle}
      >
        <ScreenHeader title="Workouts" subtitle="Log a workout to earn points." />

        <Card>
          <View style={{ gap: 12 }}>
            <TextField
              label="Duration (minutes)"
              value={duration}
              onChangeText={setDuration}
              placeholder="45"
              keyboardType="numeric"
            />
            <TextField
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Outdoor run, lift session, etc."
              autoCapitalize="sentences"
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                Outdoor session
              </Text>
              <Switch
                value={isOutdoor}
                onValueChange={setIsOutdoor}
                trackColor={{ true: theme.colors.primary2, false: theme.colors.surface2 }}
                thumbColor={theme.colors.text}
              />
            </View>

            {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}

            <PrimaryButton title={isLoading ? "Logging..." : "Log workout"} onPress={onLog} />
          </View>
        </Card>

        <Card>
          <View style={{ gap: 10 }}>
            <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Today’s logs</Text>
            {items.length === 0 ? (
              <Text style={{ color: theme.colors.muted }}>No workouts logged yet.</Text>
            ) : (
              <View style={{ gap: 10 }}>
                {items.slice(0, 10).map((w) => (
                  <View
                    key={w.id}
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: theme.colors.border,
                      paddingTop: 10,
                      gap: 2,
                    }}
                  >
                    <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                      {w.duration_mins} min {w.is_outdoor ? "outdoor" : "indoor"} session
                    </Text>
                    <Text style={{ color: theme.colors.muted }}>{w.notes || "Workout logged"}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
