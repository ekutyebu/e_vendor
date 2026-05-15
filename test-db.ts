import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Load .env
try {
    // @ts-ignore
    if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile('.env');
    }
} catch (e) {}

neonConfig.webSocketConstructor = ws;

async function testConnection() {
    const connectionString = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
        console.error('No connection string found');
        process.exit(1);
    }
    
    console.log('Connecting to:', connectionString.substring(0, 30) + '...');
    
    const pool = new Pool({ connectionString });
    
    try {
        console.log('Attempting pool.connect()...');
        const client = await pool.connect();
        console.log('Success connecting client!');
        const result = await client.query('SELECT NOW()');
        console.log('Success querying!', result.rows[0]);
        client.release();
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await pool.end();
    }
}

testConnection();
