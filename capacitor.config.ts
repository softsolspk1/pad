import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "pk.org.pad.redermconnect",
  appName: "PAD APP",
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
