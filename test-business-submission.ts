import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kvsmhbzqbiqdfrdqvbuu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2c21oYnpxYmlxZGZyZHF2YnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2MTI4NzEsImV4cCI6MjA0NjE4ODg3MX0.GaX_cKJ1trvxv97uTKPP62Ym4c-4OtgDp_-i_NdWYYo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testBusinessSubmission() {
  console.log('🧪 Testing Business Category Submission\n');
  console.log('=' .repeat(70));
  
  // First check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log('❌ No active session found!');
    console.log('📝 Please login first to test property submission');
    return;
  }
  
  console.log('✅ Authenticated as:', session.user.email);
  console.log('');
  
  // Test data for business category
  const testBusinessData = {
    user_id: session.user.id,
    title: "Test Retail Business",
    description: "Business Type: Retail Store | Revenue: ₹50,00,000 | Employees: 25\n\nThis is a test business listing to verify the submission works correctly.",
    property_type: "business",
    price: 5000000,
    price_type: 'monthly',
    city: "Mumbai",
    area: "Andheri West",
    pin_code: "400053",
    address: "Test Address, Andheri West",
    latitude: null,
    longitude: null,
    bedrooms: null,
    bathrooms: null,
    area_sqft: null,
    amenities: [],
    images: [],
    contact_name: "Test Owner",
    contact_phone: "9876543210",
    contact_email: null,
    is_agent: false,
    status: 'active',
    available: true,
    verified: true,
  };
  
  console.log('📋 Test Business Data:');
  console.log('   Title:', testBusinessData.title);
  console.log('   Type:', testBusinessData.property_type);
  console.log('   Price:', testBusinessData.price);
  console.log('   City:', testBusinessData.city);
  console.log('   Description (first 100 chars):', testBusinessData.description.substring(0, 100) + '...');
  console.log('');
  
  console.log('🔄 Attempting to insert business property...');
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([testBusinessData])
      .select();
    
    if (error) {
      console.log('❌ Submission FAILED!');
      console.log('');
      console.log('Error Details:');
      console.log('   Code:', error.code);
      console.log('   Message:', error.message);
      console.log('   Details:', error.details);
      console.log('   Hint:', error.hint);
      console.log('');
      
      // Check specific error types
      if (error.code === '23505') {
        console.log('💡 This is a duplicate key error - property might already exist');
      } else if (error.code === '23503') {
        console.log('💡 This is a foreign key constraint error');
      } else if (error.code === '42501') {
        console.log('💡 This is a permission error - check RLS policies');
      } else if (error.code === '22P02') {
        console.log('💡 This is a data type error - invalid input syntax');
      }
      
      return;
    }
    
    console.log('✅ Business property submitted successfully!');
    console.log('');
    console.log('Created Property:');
    console.log('   ID:', data[0].id);
    console.log('   Title:', data[0].title);
    console.log('   Type:', data[0].property_type);
    console.log('   Status:', data[0].status);
    console.log('');
    
    // Clean up - delete the test property
    console.log('🧹 Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', data[0].id);
    
    if (deleteError) {
      console.log('⚠️  Failed to delete test property:', deleteError.message);
      console.log('   Please manually delete property ID:', data[0].id);
    } else {
      console.log('✅ Test property cleaned up successfully');
    }
    
  } catch (error) {
    console.log('❌ Unexpected error occurred!');
    console.log('');
    console.error(error);
  }
  
  console.log('');
  console.log('=' .repeat(70));
  console.log('');
  console.log('📝 Summary:');
  console.log('   If submission failed, check:');
  console.log('   1. RLS policies on properties table');
  console.log('   2. Required fields are all provided');
  console.log('   3. Data types match database schema');
  console.log('   4. User has permission to insert');
}

testBusinessSubmission();
