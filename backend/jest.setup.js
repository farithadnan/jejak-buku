const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });

module.exports = async () => {
  // Run migrations for the in-memory DB
  execSync('npx drizzle-kit migrate', { stdio: 'inherit' });
};