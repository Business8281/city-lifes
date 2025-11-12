import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://thxrxacsrwtadvvdwken.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeHJ4YWNzcnd0YWR2dmR3a2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTQwMjgsImV4cCI6MjA3Nzg5MDAyOH0._yxKbMzL2DPwkOrManeodLIrmHurBxwI1uTiyS-U-XM";

// Create client without localStorage for Node.js environment
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  try {
    // Test 1: Check if client is initialized
    console.log('✓ Supabase client initialized');
    console.log(`  URL: https://thxrxacsrwtadvvdwken.supabase.co`);
    
    // Test 2: Check authentication state
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;
    console.log(`✓ Auth check completed`);
    console.log(`  Logged in: ${session ? 'Yes' : 'No'}`);
    if (session) {
      console.log(`  User: ${session.user.email}`);
    }
    
    // Test 3: Test database connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`⚠ Database query result: ${error.message}`);
      console.log(`  (This is expected if tables don't exist yet)`);
    } else {
      console.log('✓ Database connection successful');
      console.log(`  Profiles table accessible`);
    }
    
    // Test 4: Check storage
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    if (storageError) {
      console.log(`⚠ Storage check: ${storageError.message}`);
    } else {
      console.log('✓ Storage connection successful');
      console.log(`  Buckets: ${buckets.length}`);
    }
    
    console.log('\n✅ Supabase connection test completed!');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
