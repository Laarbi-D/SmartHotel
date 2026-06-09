import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  basePath: "/admin", 
};

export default withNextIntl(nextConfig);