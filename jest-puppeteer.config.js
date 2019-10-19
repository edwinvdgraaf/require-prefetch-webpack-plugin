module.exports = {
  launch: {
    // dumpio: true,
    // headless: false,
  },
  // browserContext: 'default',
  server: {
    command: 'yarn serve',
    // launchTimeout: 3000,
    port: 9000, // need for liveness check
    // debug: true
  }
}