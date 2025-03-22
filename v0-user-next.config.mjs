/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    pdfGenerationEnabled: true,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: process.env.API_URL || '',
  },
  webpack: (config, { isServer }) => {
    // This is needed for pdfkit to work properly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        stream: false,
        zlib: false,
      };
    }
    return config;
  },
};

export default nextConfig;

