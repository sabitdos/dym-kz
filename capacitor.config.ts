import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "kz.dym.app",
  appName: "Dym.kz",
  webDir: ".output/public",
  server: {
    androidScheme: "https",
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
}

export default config
