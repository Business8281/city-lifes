
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to Supabase...');
    console.log('URL:', supabaseUrl);

    try {
        // Try to fetch a single row from a public table, e.g., 'cities' or just check health if possible
        // We'll try 'cities' as it seems to be a core table based on previous context
        const { data, error } = await supabase.from('cities').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed:', error.message);
            process.exit(1);
        }

        console.log('Connection successful!');
        console.log('Successfully connected to Supabase project.');
    } catch (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    }
}

testConnection();
