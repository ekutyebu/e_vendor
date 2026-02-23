const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_KfFtv6VsjdD2@ep-jolly-art-aip74oww-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function testConnection() {
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected successfully!');

        const res = await client.query('SELECT current_database(), current_user, now();');
        console.log('Query result:', res.rows[0]);

        await client.end();
        console.log('Connection closed.');
    } catch (err) {
        console.error('Connection error:', err.stack);
        process.exit(1);
    }
}

testConnection();
