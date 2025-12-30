const { Client } = require('pg');

const connectionString = 'postgresql://postgres:gJQ19920820GUOJIAQI@db.fxionamswzlywcmoidds.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  console.log('Testing connection to Supabase...');
  try {
    await client.connect();
    console.log('Successfully connected to the database!');
    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0].now);
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

testConnection();
