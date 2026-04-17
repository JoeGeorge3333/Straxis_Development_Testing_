import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleHabit, toggleHabitThunk } from "@/store/slices/habitsSlice";
import { useTheme } from "@/theme/ThemeProvider";
import type { HabitTaskKey } from "@/types/api";

const TASKS: Array<{ key: HabitTaskKey; label: string; rightGlyph?: "add" }> = [
  { key: "workout_completed", label: "W1 / W2", rightGlyph: "add" },
  { key: "diet_compliance", label: "Nutrition", rightGlyph: "add" },
  { key: "water_gallon", label: "Water Consumption" },
  { key: "reading_done", label: "Read 10 pages" },
  { key: "progress_photo", label: "Progress Pic" },
];

export function TaskChecklist() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, forDate } = useAppSelector((s) => s.habits);

  return (
    <View style={{ gap: 10 }}>
      <Text
        style={{
          color: theme.colors.primary,
          fontSize: 12,
          fontWeight: "800",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Daily tasks
      </Text>

      <View style={{ gap: 10 }}>
        {TASKS.map((task) => {
          const completed = items.find((i) => i.task_key === task.key)?.completed ?? false;
          return (
            <Pressable
              key={task.key}
              onPress={() => {
                if (task.key === "workout_completed" || task.key === "workout_outdoor") {
                  router.push("/(tabs)/workouts");
                  return;
                }
                dispatch(toggleHabit({ task_key: task.key }));
                dispatch(
                  toggleHabitThunk({
                    task_key: task.key,
                    forDate,
                    completed: !completed,
                  })
                );
              }}
              style={({ pressed }) => ({
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                paddingVertical: 14,
                paddingHorizontal: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: pressed ? 0.9 : 1,
              })}
              accessibilityRole="button"
              accessibilityLabel={`Toggle ${task.label}`}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: completed ? theme.colors.primary2 : theme.colors.border,
                    backgroundColor: completed ? theme.colors.primary2 : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {completed ? (
                    <Ionicons name="checkmark" size={16} color="#05110C" />
                  ) : null}
                </View>

                <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
                  {task.label}
                </Text>
              </View>

              {task.rightGlyph ? (
                <Ionicons name="add" size={22} color={theme.colors.muted} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
