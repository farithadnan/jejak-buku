const { execSync } = require('child_process');

module.exports = async () => {
  // Run migrations for the in-memory DB
  execSync('npx drizzle-kit migrate', { stdio: 'inherit' });
};