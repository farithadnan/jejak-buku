const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });

module.exports = async () => {
  // Remove test DB if it exists
  const dbPath = path.resolve(__dirname, process.env.DATABASE_URL);
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

  // Run migrations for the test DB before tests
  execSync('npx drizzle-kit migrate', { stdio: 'inherit' });
};