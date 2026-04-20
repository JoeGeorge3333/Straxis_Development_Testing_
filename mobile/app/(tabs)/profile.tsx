import { useEffect } from "react";
import { Platform, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOutThunk } from "@/store/slices/authSlice";
import { bootstrapRuntime, setDemoModeThunk } from "@/store/slices/runtimeSlice";
import { useTheme } from "@/theme/ThemeProvider";
import { useTabScreenScrollStyle } from "@/theme/screenLayout";
import { getApiBaseUrl } from "@/config/runtime";

export default function ProfileScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.auth.profile);
  const demoMode = useAppSelector((s) => s.runtime.demoMode);

  useEffect(() => {
    dispatch(bootstrapRuntime());
  }, [dispatch]);

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
        <ScreenHeader
          title={profile?.username ?? "Profile"}
          subtitle="Account and settings."
        />

        <View
          style={{
            borderRadius: 18,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            padding: 14,
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ gap: 2, flex: 1, paddingRight: 12 }}>
              <Text style={{ color: theme.colors.text, fontWeight: "900" }}>
                Demo Mode
              </Text>
              <Text style={{ color: theme.colors.muted, fontSize: 12, lineHeight: 18 }}>
                Uses an in-app mock backend so you can preview UI and flows without the server.
              </Text>
            </View>
            <Switch
              value={demoMode}
              onValueChange={(v) => {
                void dispatch(setDemoModeThunk(v));
              }}
              trackColor={{ true: theme.colors.primary2, false: theme.colors.surface2 }}
              thumbColor={theme.colors.text}
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ color: theme.colors.muted, fontSize: 12, letterSpacing: 1 }}>
              API BASE URL
            </Text>
            <Text style={{ color: theme.colors.text, fontWeight: "800" }}>
              {getApiBaseUrl() || "(not set)"}
            </Text>
          </View>
        </View>

        <PrimaryButton title="Sign out" onPress={() => dispatch(signOutThunk())} />
      </ScrollView>
    </SafeAreaView>
  );
}
