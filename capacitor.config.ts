import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.cozyreminder',
  appName: 'cozy-reminder',
  webDir: 'dist',
  server: {
    url: 'https://02bd99cf-75e2-4f93-8301-e44f351635f4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#A855F7",
    },
  },
};

export default config;
