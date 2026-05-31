// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true, // för bättre prestanda (Next.js 14+)

  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": ".",
    };
    return config;
  },

  // CSP för produktion – tillåter backend på Render och Stripe
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.stripe.com https://*.stripe.com https://js.stripe.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://gbx-back.onrender.com https://api.stripe.com https://connect.stripe.com https://*.stripe.com https://*.stripe.dev https://c.increment.com https://edge-api.stripe.com https://stripeusercontent.com https://b.stripecdn.com",
              "frame-src 'self' https://connect.stripe.com https://*.stripe.com https://js.stripe.com",
              "img-src 'self' data: blob: https://*.stripe.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Bildoptimering (anpassa efter behov)
  images: {
    domains: ["localhost", "poolbeferest.com"],
  },

  // Miljövariabler som exponeras till klienten (valfritt)
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  turbopack: {}, // ← Lägg till denna rad
};

module.exports = nextConfig;
