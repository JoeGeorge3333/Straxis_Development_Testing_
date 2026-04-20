import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "@/store";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { bootstrapSession } from "@/store/slices/authSlice";
import { bootstrapRuntime } from "@/store/slices/runtimeSlice";

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      await store.dispatch(bootstrapRuntime());
      await store.dispatch(bootstrapSession());
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
