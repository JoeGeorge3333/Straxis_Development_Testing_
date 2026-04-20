import { Platform, type ViewStyle } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const isIOS = Platform.OS === "ios";

/** Horizontal padding for scroll screens */
export function screenPaddingX(): number {
  return isIOS ? 20 : 16;
}

/** Vertical gap between sections in scroll content */
export function sectionGap(): number {
  return isIOS ? 16 : 12;
}

/**
 * Scroll `contentContainerStyle` for screens inside the tab navigator.
 * Accounts for tab bar + home indicator so the last card clears the bar.
 */
export function useTabScreenScrollStyle(extra?: ViewStyle): ViewStyle {
  const tabBarHeight = useBottomTabBarHeight();
  const bottomInset = tabBarHeight + (isIOS ? 20 : 14);
  const base: ViewStyle = {
    paddingHorizontal: screenPaddingX(),
    paddingTop: isIOS ? 10 : 8,
    paddingBottom: bottomInset,
    gap: sectionGap(),
  };
  if (!extra) return base;

  const merged: ViewStyle = { ...base, ...extra };
  const floorFromPadding =
    typeof extra.padding === "number"
      ? extra.padding
      : typeof extra.paddingVertical === "number"
        ? extra.paddingVertical
        : typeof extra.paddingBottom === "number"
          ? extra.paddingBottom
          : 0;

  return {
    ...merged,
    // Keep last so it wins over `padding` shorthand for the bottom inset.
    paddingBottom: Math.max(bottomInset, floorFromPadding),
  };
}

/**
 * Scroll `contentContainerStyle` for auth stack (no tab bar).
 */
export function useAuthScreenScrollStyle(extra?: ViewStyle): ViewStyle {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, isIOS ? 20 : 12) + (isIOS ? 28 : 20);
  const base: ViewStyle = {
    paddingHorizontal: screenPaddingX(),
    paddingTop: isIOS ? 12 : 8,
    paddingBottom: bottomInset,
    gap: sectionGap(),
  };
  if (!extra) return base;

  const merged: ViewStyle = { ...base, ...extra };
  const floorFromPadding =
    typeof extra.padding === "number"
      ? extra.padding
      : typeof extra.paddingVertical === "number"
        ? extra.paddingVertical
        : typeof extra.paddingBottom === "number"
          ? extra.paddingBottom
          : 0;

  return {
    ...merged,
    paddingBottom: Math.max(bottomInset, floorFromPadding),
  };
}
