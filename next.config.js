import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");

/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",

        hostname: "lh3.googleusercontent.com",

        port: "",

        pathname: "/",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
