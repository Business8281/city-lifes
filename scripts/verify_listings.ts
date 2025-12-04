import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Manual .env parsing
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf-8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.warn('Failed to load .env file manually:', e);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) is missing in environment variables.');
    console.log('Available keys:', Object.keys(process.env).filter(k => k.startsWith('VITE_')));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyListing() {
    console.log('Verifying listing "Test JS Force" in Supabase...');

    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('title', 'Test JS Force');

    if (error) {
        console.error('Error fetching properties:', error);
        process.exit(1);
    }

    if (data && data.length > 0) {
        console.log('✅ Success: Listing found!');
        console.log('Listing Details:', {
            id: data[0].id,
            title: data[0].title,
            price: data[0].price,
            location: data[0].location,
            created_at: data[0].created_at
        });
    } else {
        console.error('❌ Failure: Listing "Test JS Force" not found.');
        process.exit(1);
    }
}

verifyListing();
