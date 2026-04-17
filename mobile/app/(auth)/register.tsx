import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TextField } from "@/components/TextField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerThunk } from "@/store/slices/authSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { isDemoMode } from "@/config/runtime";

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit() {
    const result = await dispatch(registerThunk({ username, email, password }));
    if (registerThunk.fulfilled.match(result)) router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <ScreenHeader title="Create account" subtitle="Join a league and start scoring." />
        <View style={{ gap: 12 }}>
          {isDemoMode() ? (
            <Text style={{ color: theme.colors.muted }}>
              Demo Mode is on — this will create a local demo session.
            </Text>
          ) : null}
          <TextField label="Username" value={username} onChangeText={setUsername} placeholder="striker" autoCapitalize="none" />
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

          <PrimaryButton title={isLoading ? "Creating..." : "Create account"} onPress={onSubmit} />

          <Text style={{ color: theme.colors.muted }}>
            Already have an account?{" "}
            <Link href="/(auth)/login" style={{ color: theme.colors.accent, fontWeight: "800" }}>
              Log in
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
