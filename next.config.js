module.exports = {
  redirects() {
    return [
      process.env.MAINTENANCE_MODE
        ? { source: "/((?!maintenance).*)", destination: "/maintenance", permanent: false }
        : { source: "/maintenance", destination: "/", permanent: false },
    ].filter(Boolean);
  },
};