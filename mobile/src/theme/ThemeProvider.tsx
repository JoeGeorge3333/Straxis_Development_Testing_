import { createContext, useContext, useMemo } from "react";
import { View } from "react-native";

import { colors, ThemeColors } from "@/theme/colors";

type Theme = {
  colors: ThemeColors;
};

const ThemeContext = createContext<Theme>({ colors });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => ({ colors }), []);
  return (
    <ThemeContext.Provider value={value}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

