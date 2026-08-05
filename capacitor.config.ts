import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "pk.org.pad.redermconnect",
  appName: "Rederm Connect",
  webDir: "www",
  server: {
    url: "https://rederm-connect.vercel.app",
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
