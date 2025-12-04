
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://thxrxacsrwtadvvdwken.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeHJ4YWNzcnd0YWR2dmR3a2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTQwMjgsImV4cCI6MjA3Nzg5MDAyOH0._yxKbMzL2DPwkOrManeodLIrmHurBxwI1uTiyS-U-XM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyLogin() {
    console.log('🔍 Verifying login...');

    const users = [
        { email: 'admin_limited@example.com', password: 'password123' },
        { email: 'owner@example.com', password: 'securePassword123' },
        { email: 'user@example.com', password: 'password123' },
    ];

    for (const u of users) {
        console.log(`Testing login for: ${u.email}`);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: u.email,
            password: u.password,
        });

        if (error) {
            console.error(`❌ Login failed for ${u.email}:`, error.message);
        } else {
            console.log(`✅ Login successful for ${u.email}`);
        }
    }
}

verifyLogin();
