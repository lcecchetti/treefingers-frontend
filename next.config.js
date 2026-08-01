const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

module.exports = {
  redirects() {
    return [
      process.env.MAINTENANCE_MODE
        ? { source: "/((?!maintenance).*)", destination: "/maintenance", permanent: false }
        : { source: "/maintenance", destination: "/", permanent: false },
    ].filter(Boolean);
  },
  headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};