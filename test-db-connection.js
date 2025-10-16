// Simple database connection test
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const connectionString = process.env.VITE_DATABASE_URL;
  
  if (!connectionString) {
    console.log('❌ No database connection string found in .env.local');
    console.log('📝 Please add your Neon database connection string to .env.local');
    console.log('🔗 Format: VITE_DATABASE_URL=postgresql://username:password@hostname:5432/database_name?sslmode=require');
    return;
  }

  console.log('🔍 Testing database connection...');
  console.log('📍 Connection string:', connectionString.replace(/:[^:@]*@/, ':***@')); // Hide password

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('⏰ Database time:', result.rows[0].current_time);
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.log('❌ Database connection failed:');
    console.log('📋 Error:', error.message);
    console.log('💡 Make sure your connection string is correct and the database exists');
  }
}

testConnection();
