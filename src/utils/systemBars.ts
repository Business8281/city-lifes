// System bar configuration at runtime for iOS + Android.
// Aligns with Apple HIG and Android system bars guidance: draw behind bars and use safe areas.
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export async function configureSystemBars(theme: "light" | "dark" = "light") {
  try {
    // Use transparent to let the app background show through
    await StatusBar.setBackgroundColor({ color: "#00000000" });

    // Choose text/icon color based on theme and background contrast
    await StatusBar.setStyle({ style: theme === "dark" ? Style.Dark : Style.Light });
  } catch (e) {
    // No-op in web or if plugin not available
    if (Capacitor.isNativePlatform()) {
      console.warn("StatusBar plugin error:", e);
    }
  }
}
