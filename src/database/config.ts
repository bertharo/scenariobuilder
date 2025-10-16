import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  connectionString: import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create Drizzle instance
export const db = drizzle(pool);

// Export pool for direct access if needed
export { pool };
