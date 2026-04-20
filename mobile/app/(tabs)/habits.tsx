import { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { TaskChecklist } from "@/components/TaskChecklist";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshHabits } from "@/store/slices/habitsSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { useTabScreenScrollStyle } from "@/theme/screenLayout";

export default function HabitsScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { forDate, error } = useAppSelector((s) => s.habits);

  useEffect(() => {
    dispatch(refreshHabits(forDate));
  }, [dispatch, forDate]);

  const scrollStyle = useTabScreenScrollStyle();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={scrollStyle}>
        <ScreenHeader title="Habits" subtitle="Today’s 75 Hard checklist." />
        {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
        <TaskChecklist />
      </ScrollView>
    </SafeAreaView>
  );
}
