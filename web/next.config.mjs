/** @type {import('next').NextConfig} */

const API_URL = process.env.API_URL || "http://127.0.0.1:8000";

const nextConfig = {
  rewrites: () => {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
