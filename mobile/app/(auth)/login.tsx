import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TextField } from "@/components/TextField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginThunk } from "@/store/slices/authSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { isDemoMode } from "@/config/runtime";

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit() {
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <ScreenHeader title="Log in" subtitle="Enter your credentials." />
        <View style={{ gap: 12 }}>
          {isDemoMode() ? (
            <Text style={{ color: theme.colors.muted }}>
              Demo Mode is on — use any email/password.
            </Text>
          ) : null}
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}

          <PrimaryButton title={isLoading ? "Signing in..." : "Continue"} onPress={onSubmit} />

          <Text style={{ color: theme.colors.muted }}>
            No account?{" "}
            <Link href="/(auth)/register" style={{ color: theme.colors.accent, fontWeight: "800" }}>
              Create one
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
