
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://thxrxacsrwtadvvdwken.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeHJ4YWNzcnd0YWR2dmR3a2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTQwMjgsImV4cCI6MjA3Nzg5MDAyOH0._yxKbMzL2DPwkOrManeodLIrmHurBxwI1uTiyS-U-XM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seedUsers() {
    console.log('🌱 Seeding users...');

    const users = [
        { email: 'owner@example.com', password: 'securePassword123', role: 'owner' },
        { email: 'user@example.com', password: 'password123', role: 'user' },
        { email: 'admin_limited@example.com', password: 'password123', role: 'admin' }, // Check if role 'admin' is valid in your schema
        { email: 'listingowner@example.com', password: 'securepassword123', role: 'owner' },
        { email: 'superadmin@example.com', password: 'superpassword123', role: 'admin' },
        { email: 'eligibleuser@example.com', password: 'correctpassword', role: 'user' },
        { email: 'normaluser@example.com', password: 'normalpassword', role: 'user' },
    ];

    for (const u of users) {
        console.log(`Creating user: ${u.email}`);
        const { error } = await supabase.auth.signUp({
            email: u.email,
            password: u.password,
            options: {
                data: {
                    full_name: u.role === 'owner' ? 'Test Owner' : 'Test User',
                    role: u.role,
                },
            },
        });

        if (error) {
            console.log(`Error creating ${u.email}:`, error.message);
        } else {
            console.log(`Successfully created/logged in ${u.email}`);
        }
    }

    console.log('✅ Seeding complete.');
}

seedUsers();
