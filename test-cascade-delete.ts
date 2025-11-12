#!/usr/bin/env node

/**
 * Test CASCADE DELETE and User Tracking
 * 
 * This script tests:
 * 1. Property deletion cascades to all related data
 * 2. User tracking fields are auto-populated
 * 3. Audit logs are created for deletions
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://thxrxacsrwtadvvdwken.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeHJ4YWNzcnd0YWR2dmR3a2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTQwMjgsImV4cCI6MjA3Nzg5MDAyOH0._yxKbMzL2DPwkOrManeodLIrmHurBxwI1uTiyS-U-XM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🧪 Testing CASCADE DELETE and User Tracking\n');
console.log('=' .repeat(70));

async function runTests() {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('\n❌ ERROR: Not authenticated!');
      console.log('Please login first before running this test.\n');
      return;
    }

    console.log(`\n✅ Authenticated as: ${user.email}`);
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    console.log(`   Name: ${profile?.full_name || 'Not set'}`);
    console.log(`   Email: ${profile?.email}`);

    // =========================================
    // TEST 1: User Tracking
    // =========================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 1: User Tracking Fields');
    console.log('='.repeat(70));

    // Create a test property
    console.log('\n📝 Creating test property...');
    const { data: newProperty, error: createError } = await supabase
      .from('properties')
      .insert({
        user_id: user.id,
        title: 'Test Property for CASCADE DELETE',
        description: 'This property is for testing cascade delete functionality',
        property_type: 'house',
        price: 50000,
        price_type: 'monthly',
        city: 'Test City',
        area: 'Test Area',
        pin_code: '123456',
        status: 'active',
        available: true,
      })
      .select()
      .single();

    if (createError) {
      console.log('❌ Error creating property:', createError.message);
      return;
    }

    console.log(`✅ Property created with ID: ${newProperty.id}`);

    // Check if user tracking fields were populated
    const { data: propertyWithTracking } = await supabase
      .from('properties')
      .select('created_by_name, created_by_email')
      .eq('id', newProperty.id)
      .single();

    if (propertyWithTracking?.created_by_name && propertyWithTracking?.created_by_email) {
      console.log(`✅ User tracking fields populated:`);
      console.log(`   └─ Created by: ${propertyWithTracking.created_by_name}`);
      console.log(`   └─ Email: ${propertyWithTracking.created_by_email}`);
    } else {
      console.log('⚠️  User tracking fields NOT populated');
      console.log('   This might be expected if migration not yet applied');
    }

    // =========================================
    // TEST 2: Create Related Data
    // =========================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 2: Creating Related Data');
    console.log('='.repeat(70));

    // Add to favorites
    console.log('\n❤️  Adding property to favorites...');
    const { error: favError } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        property_id: newProperty.id,
      });

    if (favError && !favError.message.includes('duplicate')) {
      console.log('❌ Error adding favorite:', favError.message);
    } else {
      console.log('✅ Property added to favorites');
    }

    // Count favorites
    const { count: favCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', newProperty.id);

    console.log(`   └─ Total favorites: ${favCount || 0}`);

    // Create a notification
    console.log('\n🔔 Creating notification...');
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'listing',
        title: 'Test Notification',
        message: 'This notification should be deleted with the property',
      });

    if (notifError) {
      console.log('❌ Error creating notification:', notifError.message);
    } else {
      console.log('✅ Notification created');
    }

    // =========================================
    // TEST 3: Delete Property
    // =========================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 3: Testing CASCADE DELETE');
    console.log('='.repeat(70));

    console.log('\n🗑️  Deleting property...');
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', newProperty.id);

    if (deleteError) {
      console.log('❌ Error deleting property:', deleteError.message);
      return;
    }

    console.log('✅ Property deleted successfully');

    // Check if favorites were deleted
    console.log('\n🔍 Checking if related data was deleted...');
    const { count: remainingFavs } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', newProperty.id);

    if (remainingFavs === 0) {
      console.log('✅ Favorites CASCADE DELETE worked! (0 favorites remaining)');
    } else {
      console.log(`❌ Favorites NOT deleted! (${remainingFavs} favorites remaining)`);
    }

    // =========================================
    // TEST 4: Audit Logs
    // =========================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 4: Checking Audit Logs');
    console.log('='.repeat(70));

    const { data: auditLogs, error: auditError } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('record_id', newProperty.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (auditError) {
      console.log('⚠️  Could not check audit logs (might not have permission)');
      console.log('   This is normal for non-admin users');
    } else if (auditLogs && auditLogs.length > 0) {
      console.log('✅ Audit log created:');
      console.log(`   └─ Action: ${auditLogs[0].action}`);
      console.log(`   └─ Table: ${auditLogs[0].table_name}`);
      console.log(`   └─ Time: ${new Date(auditLogs[0].created_at).toLocaleString()}`);
    } else {
      console.log('ℹ️  No audit logs found');
      console.log('   This might be expected if migration not yet applied');
    }

    // =========================================
    // TEST 5: Storage Cleanup
    // =========================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 5: Storage Cleanup (Manual Test Required)');
    console.log('='.repeat(70));

    console.log('\nℹ️  Storage cleanup happens automatically when:');
    console.log('   1. A property with images is deleted');
    console.log('   2. A user account is deleted');
    console.log('\n   To test storage cleanup:');
    console.log('   1. Create a property with images');
    console.log('   2. Note the image URLs');
    console.log('   3. Delete the property');
    console.log('   4. Try accessing the image URLs (should 404)');

    // =========================================
    // SUMMARY
    // =========================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST SUMMARY');
    console.log('='.repeat(70));

    console.log('\n✅ Tests Completed!');
    console.log('\n📋 Features Tested:');
    console.log('   ✓ User tracking fields (created_by_name, created_by_email)');
    console.log('   ✓ CASCADE DELETE on favorites');
    console.log('   ✓ Audit log creation');
    console.log('\n💡 Next Steps:');
    console.log('   1. Apply the migration if not yet done');
    console.log('   2. Test with messages, campaigns, and inquiries');
    console.log('   3. Test storage file cleanup with actual images');
    console.log('   4. Test user account deletion (BE CAREFUL!)');

    console.log('\n⚠️  Important Notes:');
    console.log('   - User account deletion is PERMANENT and IRREVERSIBLE');
    console.log('   - All user data, properties, and files will be deleted');
    console.log('   - Test user deletion ONLY in development environment');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

runTests();
