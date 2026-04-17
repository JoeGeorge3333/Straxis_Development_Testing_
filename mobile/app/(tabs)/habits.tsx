import { useEffect } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { TaskChecklist } from "@/components/TaskChecklist";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshHabits } from "@/store/slices/habitsSlice";
import { useTheme } from "@/theme/ThemeProvider";

export default function HabitsScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { forDate, error } = useAppSelector((s) => s.habits);

  useEffect(() => {
    dispatch(refreshHabits(forDate));
  }, [dispatch, forDate]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <ScreenHeader title="Habits" subtitle="Today’s 75 Hard checklist." />
        {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
        <TaskChecklist />
      </ScrollView>
    </SafeAreaView>
  );
}
