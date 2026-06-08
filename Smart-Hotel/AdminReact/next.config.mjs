// Web/next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  allowedDevOrigins: ["100.89.19.78"],   // ← ajouter cette ligne
  turbopack: {
    root: "/home/b2ciel/smarthotel/Smart-Hotel/Web",  // ← chemin absolu
  },
};

export default withNextIntl(nextConfig);