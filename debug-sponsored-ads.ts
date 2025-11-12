#!/usr/bin/env node

/**
 * Debug Sponsored Ads - Find out why ads aren't showing
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://thxrxacsrwtadvvdwken.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeHJ4YWNzcnd0YWR2dmR3a2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTQwMjgsImV4cCI6MjA3Nzg5MDAyOH0._yxKbMzL2DPwkOrManeodLIrmHurBxwI1uTiyS-U-XM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🔍 Debugging Sponsored Ads Display\n');
console.log('=' .repeat(70));

async function debug() {
  try {
    // 1. Check active campaigns
    console.log('\n1️⃣ Checking Active Ad Campaigns...');
    const { data: campaigns, error: campError } = await supabase
      .from('ad_campaigns')
      .select(`
        id,
        title,
        status,
        budget,
        spent,
        start_date,
        end_date,
        property_id,
        properties (
          title,
          city,
          area,
          pin_code,
          property_type,
          status,
          available
        )
      `)
      .eq('status', 'active');
    
    if (campError) throw campError;
    
    if (!campaigns || campaigns.length === 0) {
      console.log('   ❌ NO ACTIVE CAMPAIGNS FOUND!');
      console.log('   → This is why you don\'t see sponsored ads');
      console.log('\n   📝 To fix:');
      console.log('      1. Go to Admin Dashboard → Ad Campaigns');
      console.log('      2. Click "Create Campaign"');
      console.log('      3. Select a property');
      console.log('      4. Set budget (e.g., 1000)');
      console.log('      5. Set end date (future date)');
      console.log('      6. Click "Create Campaign"');
      return;
    }
    
    console.log(`   ✅ Found ${campaigns.length} active campaign(s):\n`);
    
    campaigns.forEach((camp: { id: string; title: string; budget: number; spent: number; status: string; start_date: string; end_date: string; property_id: string; properties: { title: string; city: string; area: string; pin_code: string; property_type: string; status: string; available: boolean }[] }, i: number) => {
      const prop = camp.properties[0];
      console.log(`   Campaign ${i + 1}: ${camp.title}`);
      console.log(`   └─ Property: ${prop?.title || 'N/A'}`);
      console.log(`   └─ Type: ${prop?.property_type || 'N/A'}`);
      console.log(`   └─ Location: ${prop?.city || 'N/A'}, ${prop?.area || 'N/A'}`);
      console.log(`   └─ PIN: ${prop?.pin_code || 'N/A'}`);
      console.log(`   └─ Budget: ₹${camp.budget}, Spent: ₹${camp.spent}`);
      console.log(`   └─ Status: ${camp.status}`);
      console.log(`   └─ End Date: ${new Date(camp.end_date).toLocaleDateString()}`);
      console.log(`   └─ Property Status: ${prop?.status}, Available: ${prop?.available}`);
      
      // Check if campaign is valid
      const now = new Date();
      const endDate = new Date(camp.end_date);
      const isExpired = endDate < now;
      const budgetExhausted = camp.spent >= camp.budget;
      
      if (isExpired) {
        console.log(`   ⚠️  EXPIRED! End date passed`);
      }
      if (budgetExhausted) {
        console.log(`   ⚠️  BUDGET EXHAUSTED! Spent ≥ Budget`);
      }
      if (prop?.status !== 'active') {
        console.log(`   ⚠️  Property is not active (${prop?.status})`);
      }
      if (!prop?.available) {
        console.log(`   ⚠️  Property is not available`);
      }
      
      if (!isExpired && !budgetExhausted && prop?.status === 'active' && prop?.available) {
        console.log(`   ✅ This campaign is VALID and should show\n`);
      } else {
        console.log(`   ❌ This campaign WON'T show (see warnings above)\n`);
      }
    });
    
    // 2. Test the function with different filters
    console.log('\n2️⃣ Testing Location Filters...\n');
    
    const testCampaign = campaigns[0];
    const testProp = testCampaign.properties[0];
    
    if (testProp) {
      console.log(`   Testing with: ${testProp.title}`);
      console.log(`   Location: ${testProp.city}, ${testProp.area}, PIN: ${testProp.pin_code}\n`);
      
      // Test City Filter
      console.log(`   🔍 Testing City Filter: "${testProp.city}"`);
      try {
        const { data, error } = await supabase
          .rpc('get_sponsored_properties', {
            filter_city: testProp.city,
            filter_area: null,
            filter_pin_code: null,
            filter_lat: null,
            filter_lng: null,
            radius_km: 10
          });
        
        if (error) {
          console.log(`      ❌ Error: ${error.message}`);
        } else {
          console.log(`      ✅ Result: ${data?.length || 0} properties`);
          if (data && data.length > 0) {
            console.log(`         Found: ${data[0].title}`);
          }
        }
      } catch (e) {
        console.log(`      ❌ Exception: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
      
      // Test Area Filter
      console.log(`\n   🔍 Testing Area Filter: "${testProp.area}"`);
      try {
        const { data, error } = await supabase
          .rpc('get_sponsored_properties', {
            filter_city: null,
            filter_area: testProp.area,
            filter_pin_code: null,
            filter_lat: null,
            filter_lng: null,
            radius_km: 10
          });
        
        if (error) {
          console.log(`      ❌ Error: ${error.message}`);
        } else {
          console.log(`      ✅ Result: ${data?.length || 0} properties`);
          if (data && data.length > 0) {
            console.log(`         Found: ${data[0].title}`);
          }
        }
      } catch (e) {
        console.log(`      ❌ Exception: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
      
      // Test PIN Filter
      console.log(`\n   🔍 Testing PIN Filter: "${testProp.pin_code}"`);
      try {
        const { data, error } = await supabase
          .rpc('get_sponsored_properties', {
            filter_city: null,
            filter_area: null,
            filter_pin_code: testProp.pin_code,
            filter_lat: null,
            filter_lng: null,
            radius_km: 10
          });
        
        if (error) {
          console.log(`      ❌ Error: ${error.message}`);
        } else {
          console.log(`      ✅ Result: ${data?.length || 0} properties`);
          if (data && data.length > 0) {
            console.log(`         Found: ${data[0].title}`);
          }
        }
      } catch (e) {
        console.log(`      ❌ Exception: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('\n💡 NEXT STEPS:\n');
    console.log('If you have an active campaign:');
    console.log('1. Note the property location (city/area/PIN)');
    console.log('2. Go to your app homepage');
    console.log('3. Click the location button (📍)');
    console.log('4. Select the SAME city/area/PIN as your campaign');
    console.log('5. Look at the TOP of the page');
    console.log('6. You should see "Sponsored Listings" section');
    console.log('7. Your property will have ⭐ SPONSORED ribbon');
    
    console.log('\nIf you DON\'T have campaigns:');
    console.log('1. Go to Admin Dashboard');
    console.log('2. Navigate to "Ad Campaigns"');
    console.log('3. Create a new campaign');
    console.log('4. Then follow the steps above');
    
  } catch (error) {
    console.error('\n❌ Debug failed:', error);
  }
}

debug();
