import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, Platform, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { useAppSelector } from "@/store/hooks";

export default function TabsLayout() {
  const theme = useTheme();
  const { token, isBootstrapping } = useAppSelector((s) => s.auth);
  const runtimeBoot = useAppSelector((s) => s.runtime.isBootstrapping);

  if (isBootstrapping || runtimeBoot) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.bg,
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          ...(Platform.OS === "ios"
            ? {
                paddingTop: 6,
                paddingBottom: 4,
                minHeight: 52,
              }
            : {}),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="speedometer-outline"
              color={color}
              size={Platform.OS === "ios" ? Math.max(size, 26) : size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="barbell-outline"
              color={color}
              size={Platform.OS === "ios" ? Math.max(size, 26) : size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="checkbox-outline"
              color={color}
              size={Platform.OS === "ios" ? Math.max(size, 26) : size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leagues"
        options={{
          title: "League",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="trophy-outline"
              color={color}
              size={Platform.OS === "ios" ? Math.max(size, 26) : size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-circle-outline"
              color={color}
              size={Platform.OS === "ios" ? Math.max(size, 26) : size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
